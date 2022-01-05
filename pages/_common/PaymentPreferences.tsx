import React from "react";
import Body from "@dvargas92495/ui/dist/components/Body";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
);

const PAYMENT_PREFERENCES = [{ label: "PayPal" }, { label: "Bank Transfer" }];

const PaymentPreferences = ({value, setValue}: {value: string, setValue: (s: string) => void}) => {
  return (
    <>
      <H4>Payment Preferences</H4>
      <Body sx={{ mt: 0, mb: 2 }}>How do you want to be paid?</Body>
      <RadioGroup
        sx={{ mb: 2 }}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      >
        {PAYMENT_PREFERENCES.map(({ label }, key) => (
          <Box sx={{ display: "flex", alignItems: "center" }} key={key}>
            <Radio value={label} sx={{ mx: 1 }} />
            {label}
          </Box>
        ))}
      </RadioGroup>
    </>
  );
};

export default PaymentPreferences;
