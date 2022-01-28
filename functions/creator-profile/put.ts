import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import { User, users } from "@clerk/clerk-sdk-node";

const logic = ({
  user,
  firstName,
  lastName,
  publicMetadata,
}: {
  user: User;
  firstName: string;
  lastName: string;
  publicMetadata: Record<string, unknown>;
}) => {
  const id = user.id || "";
  return users
    .updateUser(id, {
      firstName,
      lastName,
      publicMetadata: {
        ...user.publicMetadata,
        ...publicMetadata,
        completed: true,
      },
    })
    .then(() => ({ success: true }));
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
