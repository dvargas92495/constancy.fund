import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import type { Handler as AsyncHandler } from "../create-contract-pdf";
import { waitForContract } from "./get";

const logic = ({ uuid }: { uuid: string }) =>
  invokeAsync<Parameters<AsyncHandler>[0]>({
    path: "create-contract-pdf",
    data: { uuid },
  })
    .then(() => waitForContract(uuid))
    .then((success) => {
      if (success) {
        return {
          success,
        };
      } else {
        throw new Error(
          `Timed out waiting for contract ${uuid} to finish generating`
        );
      }
    });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
