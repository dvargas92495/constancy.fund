import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { PrismaClient } from "@prisma/client";
import { dbIdByTypeId } from "../../db/fundraise_types";

const prismaClient = new PrismaClient();

const logic = ({
  data,
  id,
  user: { id: userId },
}: {
  data: Record<string, string>;
  id: string;
  user: { id: string };
}) => {
  return prismaClient.contract
    .create({
      data: {
        type: dbIdByTypeId[id],
        status: 0,
        userId,
      },
    })
    .then((contract) =>
      prismaClient.contractDetail
        .createMany({
          data: Object.entries(data).map(([label, value]) => ({
            label,
            value,
            contractUuid: contract.uuid,
          })),
        })
        .then(() => ({ id: contract.uuid }))
    );
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
