import sendEmail from "aws-sdk-plus/dist/sendEmail";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { execute } from "../_common/mysql";
import React from "react";
import { users } from "@clerk/clerk-sdk-node";
import EmailLayout from "../_common/EmailLayout";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import eversign from "../_common/eversign";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";

const logic = ({ agreementUuid }: { agreementUuid: string }) => {
  return execute(
    `SELECT e.id, a.name, a.email, c.userId, c.type
     FROM agreement a
     INNER JOIN eversigndocument e ON a.uuid = e.agreementUuid
     INNER JOIN contract c ON c.uuid = a.contractUuid
     WHERE a.uuid = ?`,
    [agreementUuid]
  )
    .then((results) => {
      const [doc] = results as {
        id: string;
        name: string;
        email: string;
        userId: string;
        type: number;
      }[];
      if (!doc)
        throw new NotFoundError(
          `Could not find eversign document associated with agreement ${agreementUuid}`
        );
      return Promise.all([
        eversign
          .getDocumentByHash(doc.id)
          .then((r) =>
            r.getSigners().reduce((p, c) => (c.getSigned() ? p + 1 : p), 0)
          ),
        users.getUser(doc.userId).then((u) => ({
          investorEmail: doc.email,
          investorName: doc.name,
          userEmail:
            u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
              ?.emailAddress || "",
          userName: `${u.firstName} ${u.lastName}`,
          documentId: doc.id,
          contractType: FUNDRAISE_TYPES[doc.type || 0].name,
        })),
      ]);
    })
    .then(([numSigners, r]) => {
      if (numSigners === 1) {
        return sendEmail({
          to: r.userEmail,
          replyTo: r.investorEmail,
          subject: `${r.investorName} has signed the agreement!`,
          body: React.createElement(
            EmailLayout,
            {},
            React.createElement("p", {}, `Hi ${r.userName},`),
            React.createElement(
              "p",
              {},
              `Congratulations! ${r.investorName} has signed the ${r.contractType} between the two of you.`,
              React.createElement(
                "a",
                {
                  href: `${process.env.HOST}/contract?uuid=${agreementUuid}&signer=2`,
                },
                "Click here"
              ),
              ` to sign the agreement.`
            ),
            React.createElement("hr"),
            React.createElement(
              "p",
              {},
              `You could ask the investor any questions by directly replying to this email.`
            )
          ),
        });
      } else if (numSigners === 2) {
        return sendEmail({
          to: r.investorEmail,
          replyTo: r.userEmail,
          subject: `${r.userName} has signed the agreement!`,
          body: React.createElement(
            EmailLayout,
            {},
            React.createElement("p", {}, `Hi ${r.investorName},`),
            React.createElement(
              "p",
              {},
              `Congratulations! Both you and ${r.userName} have signed the ${r.contractType}! You may begin sending them funds.`
            ),
            React.createElement("hr"),
            React.createElement(
              "p",
              {},
              `You could ask the creator any questions by directly replying to this email.`
            )
          ),
        });
      } else {
        throw new MethodNotAllowedError(`No one has actually signed`);
      }
    })
    .then(() => ({ success: true }));
};

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
