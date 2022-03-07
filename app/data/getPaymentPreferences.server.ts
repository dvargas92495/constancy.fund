import PAYMENT_PREFERENCES from "../enums/paymentPreferences";
import { execute } from "./mysql.server";

const getPaymentPreferences = (userId: string) =>
  execute(
    `SELECT p.type, d.label, d.value
          FROM paymentpreference p
          INNER JOIN paymentpreferencedetail d ON d.paymentPreferenceUuid = p.uuid
          WHERE p.userId = ?`,
    [userId]
  ).then((p) => {
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
  });

export default getPaymentPreferences;
