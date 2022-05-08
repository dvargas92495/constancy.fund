import getMysql from "./mysql.server";
import { render as renderInvestorSigned } from "../emails/InvestorSigned";
import { render as renderCreatorSigned } from "../emails/CreatorSigned";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";
import getEversign from "./eversign.server";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import getPaymentPreferences from "./getPaymentPreferences.server";

const signAgreement = ({
  agreementUuid,
  // userId,
}: {
  agreementUuid: string;
  userId: string | null;
}) =>
  getMysql().then(({ execute, destroy }) => {
    return execute(
      `SELECT e.id, i.uuid, i.name, i.email, c.userId, c.type, c.uuid as contract, a.amount
     FROM agreement a
     INNER JOIN investor i ON i.uuid = a.investorUuid
     INNER JOIN eversigndocument e ON a.uuid = e.agreementUuid
     INNER JOIN contract c ON c.uuid = a.contractUuid
     WHERE a.uuid = ?`,
      [agreementUuid]
    )
      .then((results) => {
        const [doc] = results as {
          id: string;
          uuid: string;
          name: string;
          email: string;
          userId: string;
          type: number;
          contract: string;
          amount: number;
        }[];
        if (!doc)
          throw new NotFoundError(
            `Could not find eversign document associated with agreement ${agreementUuid}`
          );
        return Promise.all([
          getEversign()
            .then((eversign) => eversign.getDocumentByHash(doc.id))
            .then((r) => r.getSigners()),
          import("@clerk/clerk-sdk-node")
            .then((clerk) => clerk.users.getUser(doc.userId))
            .then((u) => ({
              investorEmail: doc.email,
              investorName: doc.name,
              investorUuid: doc.uuid,
              userEmail:
                u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
                  ?.emailAddress || "",
              userName: `${u.firstName} ${u.lastName}`,
              documentId: doc.id,
              contractType: FUNDRAISE_TYPES[doc.type || 0].name,
              contractId: FUNDRAISE_TYPES[doc.type || 0].id,
              id: u.id,
              agreementUuid: doc.uuid,
              contractUuid: doc.contract,
            })),
          execute(
            `SELECT d.label, d.value
             FROM contractdetail d
             WHERE d.contractUuid = ?`,
            [doc.contract]
          ),
          Promise.resolve(doc.amount),
        ]);
      })
      .then(([allSigners, r, details, agreementAmount]) => {
        const totalSigners = allSigners.length;
        const signers = allSigners.filter((s) => s.getSigned());
        // const noSigners = allSigners.filter((s) => !s.getSigned());
        if (signers.length === totalSigners) {
          const contractDetails = Object.fromEntries(
            (details as { label: string; value: string }[]).map((d) => [
              d.label,
              d.value,
            ])
          );
          return getPaymentPreferences(r.id || "", execute).then(
            (creatorPaymentPreferences) =>
              import("aws-sdk-plus").then((aws) =>
                aws.default.sendEmail({
                  to: r.investorEmail,
                  replyTo: r.userEmail,
                  subject: `${r.userName} has signed the agreement!`,
                  body: renderCreatorSigned({
                    investorName: r.investorName,
                    creatorName: r.userName,
                    contractType: r.contractType,
                    creatorPaymentPreferences,
                    contractDetails,
                    agreementAmount,
                  }),
                })
              )
          );
        } else if (signers.length > 0) {
          return getPaymentPreferences(r.investorUuid, execute)
            .then((investorPaymentPreferences) =>
              import("aws-sdk-plus").then((aws) =>
                aws.default.sendEmail({
                  to: r.userEmail,
                  replyTo: r.investorEmail,
                  subject: `${r.investorName} has signed the agreement!`,
                  body: renderInvestorSigned({
                    investorName: r.investorName,
                    investorPaymentPreferences,
                    creatorName: r.userName,
                    contractType: r.contractType,
                    agreementUuid,
                  }),
                })
              )
            )
            .then(() => ({}));
        } else {
          throw new MethodNotAllowedError(`No one has actually signed`);
        }
      })
      .then(() => {
        destroy();
        return { success: true };
      });
  });

export default signAgreement;
