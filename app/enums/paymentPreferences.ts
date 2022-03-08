const PAYMENT_PREFERENCES = [
  {
    id: "paypal",
    fields: ["Email Address"],
  },
  {
    id: "bank",
    fields: ["Routing Number", "Account Number"],
  },
  { id: "ethereum", fields: ["Address"] },
  { id: "bitcoin", fields: ["Address"] },
  { id: "near", fields: ["Address"] },
] as const;

export const dbTypeById = Object.fromEntries(
  PAYMENT_PREFERENCES.map(({ id }, index) => [id, index])
);

export type Id = typeof PAYMENT_PREFERENCES[number]["id"];

export default PAYMENT_PREFERENCES;
