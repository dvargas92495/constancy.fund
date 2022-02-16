import React from "react";
import Body from "@dvargas92495/ui/dist/components/Body";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
);

const PAYMENT_PREFERENCES = [
  {
    id: "paypal",
    label: <img src={"/payment-options/PayPalLabel.png"} />,
    fields: ["Email Address"],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    fields: ["Routing Number", "Account Number"],
  },
];

const paymentFieldsById = Object.fromEntries(
  PAYMENT_PREFERENCES.map(({ id, fields }) => [id, fields])
);

export type PaymentPreferenceValue = { type: string;[f: string]: string };

const PaymentPreferences = ({
  value,
  setValue,
}: {
  value: PaymentPreferenceValue;
  setValue: (s: PaymentPreferenceValue) => void;
}) => {
  return (
    <Box sx={{ marginTop: "16px" }}>
      <Box display={"flex"} sx={{ minHeight: "160px" }}>
        <RadioGroup
          sx={{ mb: 2, width: "50%" }}
          value={value.type || ""}
          onChange={(e) => setValue({ ...value, type: e.target.value })}
        >
          {PAYMENT_PREFERENCES.map(({ label, id }) => (
            <Box sx={{ display: "flex", alignItems: "center" }} key={id}>
              <Radio value={id} sx={{ mx: 1 }} />
              {label}
            </Box>
          ))}
        </RadioGroup>
        <Box sx={{ width: "50%" }}>
          {(paymentFieldsById[value.type] || []).map((f) => {
            const key = f
              .split(" ")
              .map((s, i) => (i === 0 ? s.toLowerCase() : s))
              .join("");
            return (
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                label={f}
                value={value[key] || ""}
                key={key}
                onChange={(e) => setValue({ ...value, [key]: e.target.value })}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentPreferences;
