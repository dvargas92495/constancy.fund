import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";
import PAYMENT_PREFERENCES from "~/enums/paymentPreferences";

const getEmailData = () =>
  getMysql().then(({ execute, destroy }) => {
    return Promise.all([
      import("@clerk/clerk-sdk-node").then((clerk) =>
        clerk.users.getUserList()
      ),
      execute(`
      SELECT a.uuid, a.amount, c.type, i.name, i.uuid as investor, d.label, d.value
      FROM agreement a
      INNER JOIN investor       i ON a.investorUuid = i.uuid
      INNER JOIN contract       c ON a.contractUuid = c.uuid
      INNER JOIN contractdetail d ON d.contractUuid = c.uuid
    `).then((ids) => {
        const results = ids as {
          uuid: string;
          type: number;
          name: string;
          investor: string;
          label: string;
          value: string;
          amount: number;
        }[];
        const data: Record<
          string,
          {
            type: number;
            investor: { id: string; name: string };
            details: Record<string, string>;
            amount: number;
          }
        > = {};
        results.forEach((result) => {
          if (data[result.uuid]) {
            data[result.uuid].details[result.label] = result.value;
          } else {
            data[result.uuid] = {
              type: result.type,
              investor: { id: result.investor, name: result.name },
              details: { [result.label]: result.value },
              amount: result.amount,
            };
          }
        });
        return data;
      }),
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
    ]).then(([users, agreements, p]) => {
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
        ids: Object.entries(agreements).map(
          ([uuid, { details, type, investor, amount }]) => ({
            uuid,
            type: FUNDRAISE_TYPES[type].name,
            amount, 
            details,
            investor: {
              name: investor.name,
              paymentPreferences: p
                .filter(({ userId }) => investor.id === userId)
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
          })
        ),
      };
    });
  });

export default getEmailData;
