import PAYMENT_PREFERENCES from "../enums/paymentPreferences";
import getMysql, { Execute } from "./mysql.server";

const getPaymentPreferences = (userId: string, _execute?: Execute) => {
  const connection = _execute
    ? Promise.resolve({ execute: _execute, destroy: undefined })
    : getMysql();
  return connection.then(({ execute, destroy }) =>
    execute(
      `SELECT p.type, d.label, d.value
          FROM paymentpreference p
          INNER JOIN paymentpreferencedetail d ON d.paymentPreferenceUuid = p.uuid
          WHERE p.userId = ?`,
      [userId]
    ).then((p) => {
      destroy?.();
      const results = p as { type: number; label: string; value: string }[];
      const paymentPreferences: Record<string, Record<string, string>> = {};
      results.forEach(({ type, label, value }) => {
        const id = PAYMENT_PREFERENCES[type].id;
        if (paymentPreferences[id]) {
          paymentPreferences[id][label] = value;
        } else {
          paymentPreferences[id] = { [label]: value };
        }
      });
      return paymentPreferences;
    })
  );
};

export default getPaymentPreferences;
