import PAYMENT_PREFERENCES from "../enums/paymentPreferences";

const validatePaymentPreferences = (data: Record<string, string[]>) => {
  const paymentPreferences = PAYMENT_PREFERENCES.filter(
    ({ id }) => data[`paymentPreference.${id}`]?.[0] === "on"
  ).map(
    ({ id, fields }) =>
      [
        id,
        fields
          .map((f) => f.replace(/\s/g, ""))
          .map(
            (field) =>
              [field, data[`paymentPreference.${id}.${field}`]?.[0]] as const
          ),
      ] as const
  );
  if (!paymentPreferences.length) {
    throw new Error("Must have at least one payment preference set");
  } else if (
    paymentPreferences.some(([, fields]) => fields.some(([, value]) => !value))
  ) {
    throw new Error(
      "All sub fields of a selected payment preference are required"
    );
  }
  return paymentPreferences;
};

export default validatePaymentPreferences;
