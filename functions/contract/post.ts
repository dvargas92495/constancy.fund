import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import { dbIdByTypeId } from "../../db/fundraise_types";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import type { Handler as AsyncHandler } from "../create-contract-pdf";
import type { Handler as ProfileHandler } from "../build-creator-profile-page";

const logic = ({
  data,
  id,
  user: { id: userId },
}: {
  data: Record<string, string>;
  id: string;
  user: { id: string };
}) => {
  return prisma.contract
    .create({
      data: {
        type: dbIdByTypeId[id],
        userId,
      },
    })
    .then((contract) =>
      prisma.contractDetail
        .createMany({
          data: Object.entries(data).map(([label, value]) => ({
            label,
            value,
            contractUuid: contract.uuid,
          })),
        })
        .then(() =>
          Promise.all([
            invokeAsync<Parameters<AsyncHandler>[0]>({
              path: "create-contract-pdf",
              data: { uuid: contract.uuid },
            }),
            invokeAsync<Parameters<ProfileHandler>[0]>({
              path: "build-creator-profile-page",
              data: { id: userId },
            }),
          ])
        )
        .then(() => ({ id: contract.uuid }))
    );
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
