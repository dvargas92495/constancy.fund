import { users } from "@clerk/clerk-sdk-node";
import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";
import PAYMENT_PREFERENCES from "~/enums/paymentPreferences";

const loader = () => {
  const { execute, destroy } = getMysql();
  return Promise.all([
    users.getUserList(),
    execute(`
      SELECT a.uuid, c.type, i.name, i.uuid as investor 
      FROM agreement a
      INNER JOIN investor i ON a.investorUuid = i.uuid
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
  ]).then(([users, ids, p]) => {
    destroy();
    return {
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
      ids: (
        ids as { uuid: string; type: number; name: string; investor: string }[]
      ).map(({ uuid, type, name, investor }) => ({
        uuid,
        type: FUNDRAISE_TYPES[type].name,
        investor: {
          name,
          paymentPreferences: p
            .filter(({ userId }) => investor === userId)
            .reduce((prev, { type, label, value }) => {
              const id = PAYMENT_PREFERENCES[type].id;
              if (prev[id]) {
                prev[id][label] = value;
              } else {
                prev[id] = { [label]: value };
              }
              return prev;
            }, {} as Record<string, Record<string, string>>),
        },
      })),
    };
  });
};

export default loader;
