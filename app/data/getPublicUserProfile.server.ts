import { execute } from "./mysql";
import getUserProfile from "./getUserProfile.server";

const getPublicUserProfile = (id: string) => {
  return Promise.all([
    getUserProfile(id),
    execute(
      `SELECT c.type, c.uuid, cd.label, cd.value
        FROM contract c
        INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
        WHERE c.userId = ?`,
      [id]
    ),
  ]).then(([{ id, ...u }, fs]) => {
    const results = fs as {
      type: number;
      uuid: string;
      label: string;
      value: string;
    }[];

    const fundraises: Record<
      string,
      { type: number; details: Record<string, string> }
    > = {};
    results.forEach((res) => {
      if (fundraises[res.uuid]) {
        fundraises[res.uuid].details[res.label] = res.value;
      } else {
        fundraises[res.uuid] = {
          type: res.type,
          details: { [res.label]: res.value },
        };
      }
    });
    return {
      userId: id,
      fullName: `${u.firstName} ${
        typeof u.middleName === "string" ? `${u.middleName.slice(0, 1)}. ` : ""
      }${u.lastName}`,
      ...u,
      fundraises: Object.entries(fundraises).map(([uuid, v]) => ({
        uuid,
        type: v.type,
        details: v.details,
      })),
    };
  });
};

export default getPublicUserProfile;
