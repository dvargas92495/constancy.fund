import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import type { User } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../../db/fundraise_types";

const logic = ({ user: { id } }: { user: User }) => {
  return prisma.contract
    .findMany({
      where: { userId: id || "" },
      select: {
        type: true,
        uuid: true,
        agreements: {
          select: {
            uuid: true,
          },
        },
        contractDetails: {
          select: {
            label: true,
            value: true,
            uuid: true,
          },
        },
      },
    })
    .then((fundraises) => {
      return {
        fundraises: fundraises.map((f) => ({
          uuid: f.uuid,
          type: FUNDRAISE_TYPES[f.type].id,
          investorCount: f.agreements.length,
          details: f.contractDetails,
          progress: 0,
        })),
      };
    });
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
