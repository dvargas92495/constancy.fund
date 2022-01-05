import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import type { User } from "@clerk/clerk-sdk-node";
import prisma from "../_common/prisma";
import { NotFoundError, MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const logic = ({ uuid, user: { id: userId } }: { uuid: string; user: User }) =>
  prisma.contract
    .findFirst({
      where: { uuid },
      select: { userId: true },
    })
    .then((contract) => {
      if (!contract) throw new NotFoundError(`Could not find contract ${uuid}`);
      if (userId !== contract.userId)
        throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
      return Promise.all([
        prisma.contractDetail.deleteMany({
          where: { contractUuid: uuid },
        }),
        prisma.agreement.deleteMany({ where: { contractUuid: uuid } }),
      ]).then(() => prisma.contract.delete({ where: { uuid } }));
    })
    .then(() => ({ success: true }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
