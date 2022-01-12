import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import { v4 } from "uuid";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { users } from "@clerk/clerk-sdk-node";
import {
  MethodNotAllowedError,
  BadRequestError,
} from "aws-sdk-plus/dist/errors";
import React from "react";
import EmailLayout from "../_common/EmailLayout";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import axios from "axios";
import fs from "fs";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import path from "path";

const logic = ({
  uuid,
  name,
  email,
  amount,
}: {
  name: string;
  amount: number;
  email: string;
  uuid?: string;
}) => {
  const draftUuid = v4();
  return prisma.agreement
    .update({
      where: { uuid },
      data: {
        name,
        email,
        amount,
        // draftUuid,
      },
    })
    .then(() =>
      prisma.contract
        .findFirst({
          where: { agreements: { some: { uuid } } },
          select: { userId: true, type: true, uuid: true },
        })
        .then((c) => {
          if (!c)
            throw new MethodNotAllowedError(
              `Cannot find fundraise tied to agreement ${uuid}`
            );
          return users.getUser(c.userId).then((user) => ({
            user,
            type: FUNDRAISE_TYPES[c.type].name,
            uuid: c.uuid,
          }));
        })
    )
    .then((contract) => {
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
                    file_base64: fs.readFileSync(
                      path.join(
                        FE_OUT_DIR,
                        "_contracts",
                        contract.uuid,
                        "draft.pdf"
                      ),
                      { encoding: "base64" }
                    ).toString(),
                  }
                : {
                    name: "contract",
                    file_url: `${process.env.HOST}/_contracts/${contract.uuid}/draft.pdf`,
                  },
            ],
            signers: [
              { id: 1, name, email },
              {
                id: 2,
                name: `${contract.user.firstName} ${contract.user.lastName}`,
                email: contract.user.emailAddresses.find(
                  (e) => e.id === contract.user.primaryEmailAddressId
                )?.emailAddress,
              },
            ],
            fields: [[]],
            ...(process.env.EVERSIGN_SANDBOX ? { sandbox: 1 } : {}),
          }
        )
        .then((r) => {
          if (!r.data.success) {
            throw new BadRequestError(r.data.error.type);
          }
          console.log(r.data);
          return contract;
        });
    })
    .then(({ user, type }) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const link = `${process.env.HOST}/contract?uuid=${draftUuid}`;
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
    })
    .then(() => ({ success: true }));
};

export const handler = createAPIGatewayProxyHandler(logic);

export type Handler = typeof logic;
