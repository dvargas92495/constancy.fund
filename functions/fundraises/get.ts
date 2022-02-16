import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { execute } from "../_common/mysql";
import type { User } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../../db/fundraise_types";

const logic = ({ user: { id } }: { user: User }) => {
  return execute(
    `SELECT c.type, c.uuid, a.uuid as agreementUuid, cd.label, cd.value, cd.uuid as cdUuid
     FROM contract c
     LEFT JOIN agreement a ON a.contractUuid = c.uuid
     INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
     WHERE c.userId = ?`,
    [id || ""]
  ).then((results) => {
    const fundraises: Record<
      string,
      {
        type: number;
        agreements: Set<string>;
        details: Record<string, { label: string; value: string }>;
      }
    > = {};
    (
      results as {
        type: number;
        uuid: string;
        agreementUuid: string;
        label: string;
        value: string;
        cdUuid: string;
      }[]
    ).forEach((r) => {
      if (fundraises[r.uuid]) {
        fundraises[r.uuid].type = r.type;
        fundraises[r.uuid].details[r.cdUuid] = {
          label: r.label,
          value: r.value,
        };
        if (r.agreementUuid) fundraises[r.uuid].agreements.add(r.agreementUuid);
      } else {
        fundraises[r.uuid] = {
          type: r.type,
          agreements: r.agreementUuid ? new Set([r.agreementUuid]) : new Set(),
          details: { [r.cdUuid]: { label: r.label, value: r.value } },
        };
      }
    });
    return {
      fundraises: Object.entries(fundraises).map(([uuid, result]) => ({
        uuid,
        type: FUNDRAISE_TYPES[result.type].id,
        investorCount: result.agreements.size,
        details: Object.entries(result.details).map(([uuid, det]) => ({
          ...det,
          uuid,
        })),
        progress: 0,
      })),
    };
  });
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
