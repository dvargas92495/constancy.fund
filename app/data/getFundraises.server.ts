import getMysql from "./mysql.server";
import { users } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";

const getFundraises = ({ userId }: { userId: string }) => {
  return users.getUser(userId).then((u) => {
    if (!u.publicMetadata.completed) {
      return {
        fundraises: [],
        completed: false,
      };
    }
    const { execute, destroy } = getMysql();
    return execute(
      `SELECT c.type, c.uuid, a.uuid as agreementUuid, cd.label, cd.value
     FROM contract c
     LEFT JOIN agreement a ON a.contractUuid = c.uuid
     INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
     WHERE c.userId = ?`,
      [userId]
    ).then((results) => {
      destroy();
      const fundraises: Record<
        string,
        {
          type: number;
          agreements: Set<string>;
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
        }[]
      ).forEach((r) => {
        if (fundraises[r.uuid]) {
          fundraises[r.uuid].type = r.type;
          fundraises[r.uuid].details[r.label] = r.value;
          if (r.agreementUuid)
            fundraises[r.uuid].agreements.add(r.agreementUuid);
        } else {
          fundraises[r.uuid] = {
            type: r.type,
            agreements: r.agreementUuid
              ? new Set([r.agreementUuid])
              : new Set(),
            details: { [r.label]: r.value },
          };
        }
      });

      return {
        fundraises: Object.entries(fundraises).map(([uuid, result]) => ({
          uuid,
          type: FUNDRAISE_TYPES[result.type].id,
          investorCount: result.agreements.size,
          details: result.details,
          progress: 0,
        })),
        completed: true,
      };
    });
  });
};

export default getFundraises;
