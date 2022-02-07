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
    `SELECT c.type, c.userId, a.uuid, a.amount, a.name, a.email, e.id, cd.label, cd.value
   FROM contract c
   INNER JOIN agreement a ON a.contractUuid = c.uuid
   INNER JOIN contractdetail cd ON c.uuid = cd.contractUuid
   LEFT JOIN eversigndocument e ON e.agreementUuid = a.uuid
   WHERE c.uuid = ?
   LIMIT 10`,
    [uuid]
  ).then(async (results) => {
    const fundraise = results as {
      type: number;
      userId: string;
      uuid: string;
      amount: number;
      name: string;
      email: string;
      id?: string;
      label: string;
      value: string;
    }[];
    if (!fundraise.length)
      throw new NotFoundError(`Could not find contract with id ${uuid}`);
    if (id !== fundraise[0].userId)
      throw new MethodNotAllowedError(
        `User not authorized to view agreements in contract ${uuid}`
      );
    const statuses = await Promise.all(
      Array.from(new Set(fundraise.map(({ id }) => id)))
        .filter((id) => !!id)
        .map((id) =>
          eversign
            .getDocumentByHash(id!)
            .then((r) =>
              r.getSigners().every((s) => s.getSigned())
                ? 2
                : r.getSigners()[0].getSigned()
                ? 1
                : 0
            )
            .catch(() => 0)
            .then((status) => [id, status])
        )
    ).then((entries) => Object.fromEntries(entries) as Record<string, number>);
    const agreements: Record<
      string,
      {
        amount: number;
        name: string;
        email: string;
        status: number;
      }
    > = {};
    const details: Record<string, string> = {};
    fundraise.forEach((f) => {
      agreements[f.uuid] = {
        amount: f.amount,
        name: f.name,
        email: f.email,
        status: statuses[f.id || ""] || 0,
      };
      details[f.label] = f.value;
    });
    return {
      type: FUNDRAISE_TYPES[fundraise[0].type].id,
      agreements: Object.entries(agreements).map(([uuid, a]) => ({
        uuid,
        ...a,
      })),
      details,
    };
  });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
