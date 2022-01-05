import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import { v4 } from "uuid";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { users } from "@clerk/clerk-sdk-node";
import { MethodNotAllowedError } from "aws-sdk-plus/dist/errors";
import React from "react";
import EmailLayout from "../_common/EmailLayout";
import FUNDRAISE_TYPES from "../../db/fundraise_types";

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
          select: { userId: true, type: true },
        })
        .then((c) => {
          if (!c)
            throw new MethodNotAllowedError(
              `Cannot find fundraise tied to agreement ${uuid}`
            );
          return users
            .getUser(c.userId)
            .then((user) => ({ user, type: FUNDRAISE_TYPES[c.type].name }));
        })
    )
    .then((contract) => {
      // generate final signatureless draft,
      return contract;
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

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
