import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import type { User } from "@clerk/clerk-sdk-node";
import { execute } from "../_common/mysql";
import { NotFoundError, MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const logic = ({ uuid, user: { id: userId } }: { uuid: string; user: User }) =>
  execute(
    `SELECT c.userId 
     FROM agreement a
     INNER JOIN contract c ON c.uuid = a.contractUuid
     WHERE a.uuid = ?`,
    [uuid]
  )
    .then((results) => {
      const [contract] = results as { userId: string }[];
      if (!contract)
        throw new NotFoundError(
          `Could not find contract based on agreement ${uuid}`
        );
      if (userId !== contract.userId)
        throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
      return execute(
        `DELETE FROM agreement
        WHERE uuid = ?`,
        [uuid]
      );
    })
    .then(() => ({ success: true }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
