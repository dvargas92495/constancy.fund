import { users } from "@clerk/clerk-sdk-node";
import { execute } from "./mysql.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";

const loader = () => {
  return Promise.all([
    users.getUserList(),
    execute(`
      SELECT a.uuid, c.type 
      FROM agreement a
      INNER JOIN contract c ON a.contractUuid = c.uuid
    `),
  ]).then(([users, ids]) => ({
    users: users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
    })),
    ids: (ids as { uuid: string; type: number }[]).map(({ uuid, type }) => ({
      uuid,
      type: FUNDRAISE_TYPES[type].name,
    })),
  }));
};

export default loader;
