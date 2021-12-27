import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import { PrismaClient } from "@prisma/client";
import type { User } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../../db/fundraise_types";

const prismaClient = new PrismaClient();

const logic = ({ uuid, user: { id } }: { uuid: string; user: User }) =>
  prismaClient.contract
    .findFirst({
      where: { uuid },
      select: {
        type: true,
        userId: true,
        agreements: {
          select: {
            uuid: true,
            amount: true,
            name: true,
            email: true,
            stage: true,
          },
        },
      },
    })
    .then((fundraise) => {
      if (!fundraise)
        throw new NotFoundError(`Could not find contract with id ${uuid}`);
      if (id !== fundraise.userId)
        throw new MethodNotAllowedError(`Could not find contract with id ${uuid}`);
      return {
        type: FUNDRAISE_TYPES[fundraise.type].id,
        agreements: fundraise.agreements,
      };
    });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
