import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";

type Fundraise = {
  uuid: string;
  type: number;
  progress: number;
  investorCount: number;
};

const logic = () => ({
  fundraises: [] as Fundraise[],
});

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
