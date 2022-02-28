import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
import TextFieldBox from "./TextFieldBox";
import InfoText from "./InfoText";

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

export type PaymentPreferenceValue = { type: string; [f: string]: string };

const PaymentPreferences = ({
  defaultValue = {type: ''},
}: {
  defaultValue?: PaymentPreferenceValue;
}) => {
  const [radioType, setRadioType] = useState(defaultValue.type);
  return (
    <>
      <SectionTitle>Payment Preferences</SectionTitle>
      <InfoText>
        Which payment options do have available for sending and receiving funds?
      </InfoText>
      <TextFieldBox>
        <Box sx={{ marginTop: "16px", width: "100%" }}>
          <Box display={"flex"} sx={{ minHeight: "160px", width: "100%" }}>
            <RadioGroup
              sx={{ mb: 2, width: "50%" }}
              defaultValue={defaultValue.type}
              name={"paymentPreferenceType"}
              onChange={(e) => setRadioType(e.target.value)}
            >
              {PAYMENT_PREFERENCES.map(({ label, id }) => (
                <Box sx={{ display: "flex", alignItems: "center" }} key={id}>
                  <Radio value={id} sx={{ mx: 1 }} required />
                  {label}
                </Box>
              ))}
            </RadioGroup>
            <Box sx={{ width: "50%" }}>
              {(paymentFieldsById[radioType] || []).map((f) => {
                const key = f.replace(/ /g, "");
                const name = `paymentPreference${key}`;
                return (
                  <TextField
                    sx={{ mb: 2 }}
                    required
                    fullWidth
                    label={f}
                    defaultValue={
                      defaultValue[
                        `${key.slice(0, 1).toLowerCase()}${key.slice(1)}`
                      ] || ""
                    }
                    key={key}
                    name={name}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </TextFieldBox>
    </>
  );
};

export default PaymentPreferences;
