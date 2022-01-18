import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
// import { v4 } from "uuid";
import { users } from "@clerk/clerk-sdk-node";
import {
  MethodNotAllowedError,
  BadRequestError,
  InternalServorError,
} from "aws-sdk-plus/dist/errors";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import path from "path";
import axios from "axios";
import fs from "fs";

/*
File some issues to eversign
import { Client, Document, File, Signer } from "eversign";
const eversign = new Client(process.env.EVERSIGN_API_KEY || "", 398320);
const file = new File(
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
      const document = new Document({
        reminders: true,
        requireAllSigners: true,
        custom_requester_email: email,
        custom_requester_name: name,
        embeddedSigningEnabled: true,
        files: [file],
        signers: [
          new Signer({ id: 1, name, email }),
          new Signer({
            id: 2,
            name: `${contract.user.firstName} ${contract.user.lastName}`,
            email:
              contract.user.emailAddresses.find(
                (e) => e.id === contract.user.primaryEmailAddressId
              )?.emailAddress || "",
          }),
        ],
        fields: [],
        meta: {
          agreementUuid: contract.agreementUuid,
          userId: contract.user.id || "",
          type: contract.type,
        },
        ...(process.env.EVERSIGN_SANDBOX ? { sandbox: true } : {}),
      });
      eversign.createDocument(document).then((r) => {
            return { ...contract, id: r.getDocumentHash() };
          })
            // missing_file_name bug
*/

const logic = ({
  uuid,
  name,
  email,
  amount,
  contractUuid,
}: {
  name: string;
  amount: number;
  email: string;
  uuid?: string;
  contractUuid: string;
}) => {
  // const draftUuid = v4(); in case we need to regenerate the uuid for the version with the investor
  return (
    uuid
      ? prisma.agreement.update({
          where: { uuid },
          data: {
            name,
            email,
            amount,
            // draftUuid,
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
        .then((c) => {
          if (!c)
            throw new MethodNotAllowedError(
              `Cannot find fundraise tied to agreement ${a.uuid}`
            );
          return users.getUser(c.userId).then((user) => ({
            user,
            type: FUNDRAISE_TYPES[c.type].name,
            uuid: c.uuid,
            agreementUuid: a.uuid,
          }));
        })
    )
    .then((contract) => {
      const filePath = `_contracts/${contract.uuid}/draft.pdf`;
      // const filePath = `_contracts/${contract.uuid}/${draftUuid}.pdf`;
      const creatorName = `${contract.user.firstName} ${contract.user.lastName}`;
      const creatorEmail = contract.user.emailAddresses.find(
        (e) => e.id === contract.user.primaryEmailAddressId
      )?.emailAddress;

      return axios
        .post(
          `https://api.eversign.com/api/document?access_key=${process.env.EVERSIGN_API_KEY}&business_id=398320`,
          {
            reminders: 1,
            require_all_signers: 1,
            custom_requester_name: name,
            custom_requester_email: email,
            embedded_signing_enabled: 1,
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
              { id: 1, name, email },
              {
                id: 2,
                name: creatorName,
                email: creatorEmail,
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
          return { ...contract, id: r.data.document_hash };
        });
    })
    /*.then(({ user, type, id }) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const link = `${process.env.HOST}/contract?id=${id}&signer=${1}`;
      return sendEmail({
        to: email,
        subject: `[ACTION REQUIRED] Sign new agreement with ${fullName}`,
        body: React.createElement(
          EmailLayout,
          {},
          React.createElement("p", {}, `Hi ${name},`),
          React.createElement(
            "p",
            {},
            `We have generated a ${type} between both you and ${fullName} to sign. Please click on the secure link below to sign your contract.`
          ),
          React.createElement(
            "p",
            {},
            React.createElement(
              "a",
              {
                href: link,
                rel: "noopener",
                target: "_blank",
              },
              link
            )
          ),
          React.createElement("hr"),
          React.createElement(
            "p",
            {},
            `If you have any questions for ${fullName}, feel free to reply directly to this email.`
          )
        ),
        replyTo:
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || undefined,
      });
    })*/
    .then(({id }) => ({ id }))
    .catch((e) => {
      console.error(e);
      throw new InternalServorError(e.type || e.message);
    });
};

export const handler = createAPIGatewayProxyHandler(logic);

export type Handler = typeof logic;
