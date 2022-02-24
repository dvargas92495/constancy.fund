import { users } from "@clerk/clerk-sdk-node";
import { execute } from "./mysql";

const loader = () => {
  return Promise.all([
    users.getUserList(),
    execute(`SELECT a.uuid FROM agreement a`),
  ]).then(([users, ids]) => ({
    users: users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
    })),
    ids: (ids as { uuid: string }[]).map(({ uuid }) => uuid),
  }));
};

export default loader;
