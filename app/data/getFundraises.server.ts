import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";

const getFundraises = ({ userId }: { userId: string }) => {
  return import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then((u) => {
      if (!u.publicMetadata.completed) {
        return {
          fundraises: [],
          completed: false,
        };
      }
      return getMysql().then(({ execute, destroy }) => {
        return execute(
          `SELECT c.type, c.uuid, a.uuid as agreementUuid, cd.label, cd.value, cc.value as clause
     FROM contract c
     LEFT JOIN agreement a ON a.contractUuid = c.uuid
     INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
     LEFT JOIN contractclause cc ON cc.contractUuid = c.uuid
     WHERE c.userId = ?`,
          [userId]
        ).then((results) => {
          destroy();
          const fundraises: Record<
            string,
            {
              type: number;
              agreements: Set<string>;
              clauses: Set<string>;
              details: Record<string, string>;
            }
          > = {};
          (
            results as {
              type: number;
              uuid: string;
              agreementUuid: string;
              label: string;
              value: string;
              clause?: string;
            }[]
          ).forEach((r) => {
            if (fundraises[r.uuid]) {
              fundraises[r.uuid].type = r.type;
              fundraises[r.uuid].details[r.label] = r.value;
              if (r.agreementUuid)
                fundraises[r.uuid].agreements.add(r.agreementUuid);
              if (r.clause) fundraises[r.uuid].clauses.add(r.clause);
            } else {
              fundraises[r.uuid] = {
                type: r.type,
                agreements: r.agreementUuid
                  ? new Set([r.agreementUuid])
                  : new Set(),
                details: { [r.label]: r.value },
                clauses: r.clause ? new Set([r.clause]) : new Set(),
              };
            }
          });

          return {
            fundraises: Object.entries(fundraises).map(([uuid, result]) => ({
              uuid,
              type: FUNDRAISE_TYPES[result.type].id,
              investorCount: result.agreements.size,
              details: result.details,
              clauses: result.clauses,
              progress: 0,
            })),
            completed: true,
          };
        });
      });
    });
};

export default getFundraises;
