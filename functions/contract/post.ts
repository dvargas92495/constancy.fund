import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";

const logic = ({ data, id }: { data: Record<string, string>; id: string }) => {
  console.log(id);
  console.log(data);
  return Promise.resolve({ success: true });
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
