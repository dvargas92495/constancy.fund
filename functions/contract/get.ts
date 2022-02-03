import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import { execute } from "../_common/mysql";
import type { User } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import { Client } from "@dvargas92495/eversign";
const eversign = new Client(process.env.EVERSIGN_API_KEY || "", 398320);

const logic = ({ uuid, user: { id } }: { uuid: string; user: User }) =>
  execute(
    `SELECT c.type, c.userId, a.uuid, a.amount, a.name, a.email, e.id
   FROM contract c
   INNER JOIN agreement a ON a.contractUuid = c.uuid
   LEFT JOIN eversigndocument e ON e.agreementUuid = a.uuid
   WHERE c.uuid = ?
   LIMIT 10`,
    [uuid]
  ).then((results) => {
    const fundraise = results as {
      type: number;
      userId: string;
      uuid: string;
      amount: number;
      name: string;
      email: string;
      id?: string;
    }[];
    if (!fundraise.length)
      throw new NotFoundError(`Could not find contract with id ${uuid}`);
    if (id !== fundraise[0].userId)
      throw new MethodNotAllowedError(
        `User not authorized to view agreements in contract ${uuid}`
      );
    return Promise.all(
      fundraise.map(({ id, userId, type, ...a }) =>
        (id
          ? eversign
              .getDocumentByHash(id)
              .then((r) =>
                r.getSigners().every((s) => s.getSigned())
                  ? 2
                  : r.getSigners()[0].getSigned()
                  ? 1
                  : 0
              )
          : Promise.resolve(0)
        ).then((status) => ({
          ...a,
          status,
        }))
      )
    ).then((agreements) => ({
      type: FUNDRAISE_TYPES[fundraise[0].type].id,
      agreements,
    }));
  });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
