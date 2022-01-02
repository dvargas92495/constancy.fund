import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import type { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import React from "react";
import EmailLayout from "../_common/EmailLayout";

const prismaClient = new PrismaClient();

const logic = ({
  user,
  uuid,
  name,
  email,
  amount,
}: {
  user: User;
  uuid: string;
  name: string;
  email: string;
  amount: number;
}) => {
  return prismaClient.contract
    .findFirst({ where: { uuid } })
    .then((fundraise) => {
      if (!fundraise)
        throw new NotFoundError(`Could not find contract with id ${uuid}`);
      if (user.id !== fundraise.userId)
        throw new MethodNotAllowedError(
          `Could not find contract with id ${uuid}`
        );
      return prismaClient.agreement.create({
        data: {
          name,
          email,
          amount,
          contractUuid: uuid,
          stage: 0,
        },
      });
    })
    .then((agreement) =>
      sendEmail({
        to: email,
        replyTo:
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || undefined,
        subject: `Invitation to fund ${user.firstName} ${user.lastName}`,
        body: React.createElement(
          EmailLayout,
          {},
          React.createElement("p", {}, `Hi ${name},`),
          React.createElement(
            "p",
            {},
            `You have been invited to invest in ${user.firstName} ${user.lastName}. `,
            React.createElement(
              "a",
              {
                href: `${process.env.HOST}/creator/${user.id}?agreement=${agreement.uuid}`,
              },
              "Click here"
            ),
            ` to visit this creator's public profile and enter your details.`
          ),
          React.createElement("hr"),
          React.createElement(
            "p",
            {},
            `You could ask the creator any questions by directly replying to this email.`
          )
        ),
      }).then(() => ({ uuid: agreement.uuid }))
    );
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
