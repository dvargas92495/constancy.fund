import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import type { User } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { NotFoundError, MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const prismaClient = new PrismaClient();

const logic = ({ uuid, user: { id: userId } }: { uuid: string; user: User }) =>
  prismaClient.contract
    .findFirst({
      where: { uuid },
      select: { userId: true },
    })
    .then((contract) => {
      if (!contract) throw new NotFoundError(`Could not find contract ${uuid}`);
      if (userId !== contract.userId)
        throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
      return Promise.all([
        prismaClient.contractDetail.deleteMany({
          where: { contractUuid: uuid },
        }),
        prismaClient.agreement.deleteMany({ where: { contractUuid: uuid } }),
      ]).then(() => prismaClient.contract.delete({ where: { uuid } }));
    })
    .then(() => ({ success: true }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
