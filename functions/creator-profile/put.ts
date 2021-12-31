import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import { User, users } from "@clerk/clerk-sdk-node";
import type { Handler as AsyncHandler } from "../build-creator-profile-page";
import { formatError } from "@dvargas92495/api";

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
    .then(() =>
      invokeAsync<Parameters<AsyncHandler>[0]>({
        path: "build-creator-profile-page",
        data: {
          id,
        },
      }).catch((e) => console.error(formatError(e)))
    )
    .then(() => ({ success: true }));
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
