import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { PrismaClient } from "@prisma/client";
import { dbIdByTypeId } from "../../db/fundraise_types";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import type { Handler as AsyncHandler } from "../create-contract-pdf";

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
        .then(() =>
          invokeAsync<Parameters<AsyncHandler>[0]>({
            path: "create-contract-pdf",
            data: { uuid: contract.uuid },
          })
        )
        .then(() => ({ id: contract.uuid }))
    );
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
