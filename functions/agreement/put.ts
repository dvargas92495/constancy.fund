import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import { users } from "@clerk/clerk-sdk-node";
import {
  MethodNotAllowedError,
  InternalServorError,
  BadRequestError,
} from "aws-sdk-plus/dist/errors";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import path from "path";
import invokeDirect from "@dvargas92495/api/invokeDirect";
import type { Handler as ContractHandler } from "../create-contract-pdf";
// import { Client, Document, File, Signer } from "eversign";
// const eversign = new Client(process.env.EVERSIGN_API_KEY || "", 398320);
import axios from "axios";
import fs from "fs";

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
  return (
    uuid
      ? prisma.agreement.update({
          where: { uuid },
          data: {
            name,
            email,
            amount,
          },
        })
      : prisma.agreement.create({
          data: {
            name,
            email,
            amount,
            contractUuid,
            stage: 0,
          },
        })
  )
    .then((a) =>
      prisma.contract
        .findFirst({
          where: { agreements: { some: { uuid: a.uuid } } },
          select: { userId: true, type: true, uuid: true },
        })
        .then(async (c) => {
          if (!c)
            throw new MethodNotAllowedError(
              `Cannot find fundraise tied to agreement ${a.uuid}`
            );
          await invokeDirect<Parameters<ContractHandler>[0]>({
            path: "create-contract-pdf",
            data: {
              uuid: c.uuid,
              outfile: a.uuid,
              inputData: {
                investor: name,
                investor_location: investorAddress,
                investor_company: investorCompany,
                investor_company_type: investorCompanyType,
              },
            },
          });
          return users.getUser(c.userId).then((user) => ({
            user,
            type: FUNDRAISE_TYPES[c.type].name,
            uuid: c.uuid,
            agreementUuid: a.uuid,
          }));
        })
    )
    .then((contract) => {
      const filePath = `_contracts/${contract.uuid}/${contract.agreementUuid}.pdf`;
      const creatorName = `${contract.user.firstName} ${contract.user.lastName}`;
      const creatorEmail =
        contract.user.emailAddresses.find(
          (e) => e.id === contract.user.primaryEmailAddressId
        )?.emailAddress || "";

      /*const file = new File(
        process.env.NODE_ENV === "development"
          ? {
              name: "contract",
              filePath: path.join(FE_OUT_DIR, filePath),
            }
          : {
              name: "contract",
              fileUrl: `${process.env.HOST}/${filePath}`,
            }
      );

      const investorSigner = new Signer({ id: 1, name, email });
      const creatorSigner = new Signer({
        id: 2,
        name: creatorName,
        email: creatorEmail,
      });

      const document = new Document({
        reminders: true,
        requireAllSigners: true,
        custom_requester_email: creatorEmail,
        custom_requester_name: creatorName,
        embeddedSigningEnabled: true,
        meta: {
          agreementUuid: contract.agreementUuid,
          userId: contract.user.id || "",
          type: contract.type,
        },
        ...(process.env.EVERSIGN_SANDBOX ? { sandbox: true } : {}),
      });

      document.appendFile(file);
      document.appendSigner(investorSigner);
      document.appendSigner(creatorSigner);

      return eversign.createDocument(document).then((r) => {
        return { ...contract, id: r.getDocumentHash() };
      });*/
      return axios
        .post(
          `https://api.eversign.com/api/document?access_key=${process.env.EVERSIGN_API_KEY}&business_id=398320`,
          {
            reminders: 1,
            require_all_signers: 1,
            custom_requester_name: creatorName,
            custom_requester_email: creatorEmail,
            embedded_signing_enabled: 1,
            use_signer_order: 1,
            files: [
              process.env.HOST?.includes("localhost")
                ? {
                    name: "contract",
                    file_base64: fs
                      .readFileSync(path.join(FE_OUT_DIR, filePath), {
                        encoding: "base64",
                      })
                      .toString(),
                  }
                : {
                    name: "contract",
                    file_url: `${process.env.HOST}/${filePath}`,
                  },
            ],
            signers: [
              { id: 1, name, email, order: 1 },
              {
                id: 2,
                name: creatorName,
                email: creatorEmail,
                order: 2,
              },
            ],
            meta: {
              agreementUuid: contract.agreementUuid,
              userId: contract.user.id || "",
              type: contract.type,
            },
            fields: [[]],
            ...(process.env.EVERSIGN_SANDBOX ? { sandbox: 1 } : {}),
          }
        )
        .then((r) => {
          if (r.data.success === false) {
            // success true is not on a good record
            throw new BadRequestError(r.data.error.type);
          }
          return { ...contract, id: r.data.document_hash as string };
        });
    })
    .then((r) =>
      prisma.eversignDocument
        .create({
          data: { agreementUuid: r.agreementUuid, id: r.id },
        })
        .then(() => r.agreementUuid)
    )
    .then((uuid) => ({ uuid }))
    .catch((e) => {
      console.error(e);
      throw new InternalServorError(e.type || e.message);
    });
};

export const handler = createAPIGatewayProxyHandler(logic);

export type Handler = typeof logic;
