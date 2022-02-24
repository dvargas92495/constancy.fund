import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import type { User } from "@clerk/clerk-sdk-node";
import prisma from "../_common/prisma";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { render } from "../../app/emails/InvitationToFund";

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
  return prisma.contract
    .findFirst({ where: { uuid } })
    .then((fundraise) => {
      if (!fundraise)
        throw new NotFoundError(`Could not find contract with id ${uuid}`);
      if (user.id !== fundraise.userId)
        throw new MethodNotAllowedError(
          `Could not find contract with id ${uuid}`
        );
      return prisma.agreement.create({
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
        body: render({
          investorName: name,
          creatorName: `${user.firstName} ${user.lastName}`,
          creatorId: user.id || "",
          agreementUuid: agreement.uuid,
        }),
      }).then(() => ({ uuid: agreement.uuid }))
    );
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
