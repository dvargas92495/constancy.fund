import { users } from "@clerk/clerk-sdk-node";
import { execute } from "./mysql.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";
import PAYMENT_PREFERENCES from "~/enums/paymentPreferences";

const loader = () => {
  return Promise.all([
    users.getUserList(),
    execute(`
      SELECT a.uuid, c.type 
      FROM agreement a
      INNER JOIN contract c ON a.contractUuid = c.uuid
    `),
    execute(
      `SELECT p.type, d.label, d.value, p.userId
      FROM paymentpreference p
      INNER JOIN paymentpreferencedetail d ON d.paymentPreferenceUuid = p.uuid`
    ).then((p) => {
      return p as {
        type: number;
        label: string;
        value: string;
        userId: string;
      }[];
    }),
  ]).then(([users, ids, p]) => ({
    users: users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      paymentPreferences: p
        .filter(({ userId }) => u.id === userId)
        .reduce((prev, { type, label, value }) => {
          const id = PAYMENT_PREFERENCES[type].id;
          if (prev[id]) {
            prev[id][label] = value;
          } else {
            prev[id] = { [label]: value };
          }
          return prev;
        }, {} as Record<string, Record<string, string>>),
    })),
    ids: (ids as { uuid: string; type: number }[]).map(({ uuid, type }) => ({
      uuid,
      type: FUNDRAISE_TYPES[type].name,
    })),
  }));
};

export default loader;
