import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { execute } from "../../app/data/mysql";
import { users } from "@clerk/clerk-sdk-node";
import {
  MethodNotAllowedError,
  InternalServorError,
  BadRequestError,
} from "aws-sdk-plus/dist/errors";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import { FE_PUBLIC_DIR } from "fuegojs/dist/common";
import path from "path";
import invokeDirect from "@dvargas92495/api/invokeDirect";
import type { Handler as ContractHandler } from "../create-contract-pdf";
import { Client, Document, File, Signer } from "@dvargas92495/eversign";
import { v4 } from "uuid";

const eversign = new Client(process.env.EVERSIGN_API_KEY || "", 398320);

const logic = ({
  uuid,
  name,
  email,
  amount,
  contractUuid,
  investorCompany,
  investorCompanyType,
  investorAddress,
}: {
  name: string;
  amount: number;
  email: string;
  uuid?: string;
  contractUuid: string;
  investorCompany: string;
  investorCompanyType: string;
  investorAddress: string;
}) => {
  if (amount < 100) {
    throw new BadRequestError(`Minimum investment required is $100`);
  }
  return (
    uuid
      ? execute(
          `UPDATE agreement 
           SET name=?, email=?, amount=?
           WHERE uuid=?`,
          [name, email, amount, uuid]
        ).then(() => uuid)
      : Promise.resolve(v4()).then((u) =>
          execute(
            `INSERT INTO agreement (uuid, name, email, amount, contractUuid, stage)
           VALUES (?, ?, ?, ?, ?, 0)`,
            [u, name, email, amount, contractUuid]
          ).then(() => u)
        )
  )
    .then((agreementUuid) => {
      return execute(
        `SELECT c.userId, c.type, c.uuid, d.label, d.value
          FROM contract c
          INNER JOIN agreement a ON a.contractUuid = c.uuid
          INNER JOIN contractdetail d ON d.contractUuid = c.uuid
          WHERE a.uuid = ?`,
        [agreementUuid]
      ).then(async (results) => {
        const details = results as {
          uuid: string;
          type: number;
          userId: string;
          label: string;
          value: string;
        }[];
        const [c] = details;
        if (!c)
          throw new MethodNotAllowedError(
            `Cannot find fundraise tied to agreement ${agreementUuid}`
          );
        const detailData = Object.fromEntries(
          details.map(({ label, value }) => [label, value])
        );
        const capSpace = Number(detailData.amount) * Number(detailData.frequency);
        const investorShare = amount / capSpace;
        if (investorShare > 1) {
          throw new BadRequestError(`Cannot request to invest more than the available cap space ${capSpace}`);
        }
        return Promise.all([
          users.getUser(c.userId),
          invokeDirect<Parameters<ContractHandler>[0]>({
            path: "create-contract-pdf",
            data: {
              uuid: c.uuid,
              outfile: agreementUuid,
              inputData: {
                investor: name,
                investor_location: investorAddress,
                investor_company: investorCompany,
                investor_company_type: investorCompanyType,
                amount: (Number(detailData.amount) * investorShare).toString(),
                share: (Number(detailData.share) * investorShare).toString(),
                return: (Number(detailData.return) * investorShare).toString(),
              },
            },
          }),
        ]).then(([user]) => ({
          user,
          type: FUNDRAISE_TYPES[c.type].name,
          uuid: c.uuid,
          agreementUuid,
        }));
      });
    })
    .then((contract) => {
      console.log("contract generated");
      const filePath = `_contracts/${contract.uuid}/${contract.agreementUuid}.pdf`;
      const creatorName = `${contract.user.firstName} ${contract.user.lastName}`;
      const creatorEmail =
        contract.user.emailAddresses.find(
          (e) => e.id === contract.user.primaryEmailAddressId
        )?.emailAddress || "";

      const file = new File(
        process.env.NODE_ENV === "development"
          ? {
              name: "contract",
              filePath: path.join(FE_PUBLIC_DIR, filePath),
            }
          : {
              name: "contract",
              fileUrl: `${process.env.HOST}/${filePath}`,
            }
      );

      const investorSigner = new Signer({
        id: 1,
        name,
        email,
        deliverEmail: false,
      });
      const creatorSigner = new Signer({
        id: 2,
        name: creatorName,
        email: creatorEmail,
        deliverEmail: false,
      });

      const document = new Document({
        reminders: true,
        requireAllSigners: true,
        custom_requester_email: creatorEmail,
        custom_requester_name: creatorName,
        embeddedSigningEnabled: true,
        ...(process.env.EVERSIGN_SANDBOX ? { sandbox: true } : {}),
      });

      document.appendFile(file);
      document.appendSigner(investorSigner);
      document.appendSigner(creatorSigner);

      console.log("eversign prepared");
      return eversign.createDocument(document).then((r) => {
        console.log("eversign generated");
        return { ...contract, id: r.getDocumentHash() };
      });
    })
    .then((r) =>
      execute(
        `INSERT INTO eversigndocument (id, agreementUuid)
        VALUES (?,?)`,
        [r.id, r.agreementUuid]
      ).then(() => {
        return r.agreementUuid;
      })
    )
    .then((uuid) => ({ uuid }))
    .catch((e) => {
      console.error(e);
      throw new InternalServorError(e.type || e.message);
    });
};

export const handler = createAPIGatewayProxyHandler(logic);

export type Handler = typeof logic;
