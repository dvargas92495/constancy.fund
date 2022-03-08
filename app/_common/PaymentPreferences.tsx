import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
import TextFieldBox from "./TextFieldBox";
import InfoText from "./InfoText";
import PAYMENT_PREFERENCES, { Id } from "../enums/paymentPreferences";
import paymentLabelsById from "../_common/PaymentLabelsById";

const paymentFieldsById = Object.fromEntries(
  PAYMENT_PREFERENCES.map(({ id, fields }) => [id, fields])
);

const PaymentPreference = ({
  id,
  defaultValue,
}: {
  id: Id;
  defaultValue?: Record<string, string>;
}) => {
  const [checked, setChecked] = useState(!!defaultValue);
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            name={`paymentPreference.${id}`}
          />
        }
        label={paymentLabelsById[id]}
      />
      {checked && (
        <Box sx={{ width: "50%", marginLeft: "64px" }}>
          {(paymentFieldsById[id] || []).map((f) => {
            const key = f.replace(/ /g, "");
            const name = `paymentPreference.${id}.${key}`;
            return (
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                label={f}
                defaultValue={defaultValue?.[key] || ""}
                key={key}
                name={name}
              />
            );
          })}
        </Box>
      )}
    </>
  );
};

const PaymentPreferences = ({
  defaultValue = {},
}: {
  defaultValue?: Record<string, Record<string, string>>;
}) => {
  return (
    <>
      <SectionTitle>Payment Preferences</SectionTitle>
      <InfoText>
        Which payment options do you have available for sending and receiving
        funds?
      </InfoText>
      <TextFieldBox>
        <Box sx={{ marginTop: "16px", width: "100%" }}>
          <Box display={"flex"} sx={{ minHeight: "160px", width: "100%" }}>
            <FormGroup sx={{ width: "100%" }}>
              {PAYMENT_PREFERENCES.map(({ id }) => (
                <PaymentPreference
                  key={id}
                  id={id}
                  defaultValue={defaultValue[id]}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
      </TextFieldBox>
    </>
  );
};

export default PaymentPreferences;
