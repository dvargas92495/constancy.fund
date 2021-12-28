import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import type { Handler as AsyncHandler } from "../create-contract-pdf";

const logic = ({ uuid }: { uuid: string }) =>
  invokeAsync<Parameters<AsyncHandler>[0]>({
    path: "create-contract-pdf",
    data: { uuid },
  }).then(() => ({ success: true }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
