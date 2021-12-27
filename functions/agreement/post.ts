import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import type { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

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
    .then((agreement) => ({ uuid: agreement.uuid }));
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
