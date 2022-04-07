import Checkbox from "@mui/material/Checkbox";
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
import styled from "styled-components";

const paymentFieldsById = Object.fromEntries(
  PAYMENT_PREFERENCES.map(({ id, fields }) => [id, fields])
);

const Row = styled.div`
  width: 50%;
  margin-left: 31px;
`;

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
        <Row>
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
        </Row>
      )}
    </>
  );
};

const Group = styled.div`
  width: 100%;
`;

const Preferences = styled.div`
  display: flex;
  min-height: 160px;
  width: 100%;
`;

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
        <Group>
          <Preferences>
            <FormGroup sx={{ width: "100%" }}>
              {PAYMENT_PREFERENCES.map(({ id }) => (
                <PaymentPreference
                  key={id}
                  id={id}
                  defaultValue={defaultValue[id]}
                />
              ))}
            </FormGroup>
          </Preferences>
        </Group>
      </TextFieldBox>
    </>
  );
};

export default PaymentPreferences;
