import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import TextInputOneLine from "./TextInputOneLine";
import TextInputContainer from "./TextInputContainer";
import TextFieldDescription from "./TextFieldDescription";
import SectionTitle from "./SectionTitle";
import TextFieldBox from "./TextFieldBox";
import InfoText from "./InfoText";
import PAYMENT_PREFERENCES, { Id } from "../enums/paymentPreferences";
import paymentLabelsById from "./PaymentLabelsById";

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
        <Box sx={{ width: "50%", marginLeft: "31px" }}>
          {(paymentFieldsById[id] || []).map((f) => {
            const key = f.replace(/ /g, "");
            const name = `paymentPreference.${id}.${key}`;
            return (
              <TextFieldBox key={key}>
                <TextFieldDescription required>{f}</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    name={name}
                    required
                    defaultValue={defaultValue?.[key] || ""}
                  />
                </TextInputContainer>
              </TextFieldBox>
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
        <Box sx={{ width: "100%" }}>
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
