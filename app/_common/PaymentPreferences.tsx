import Checkbox from "~/_common/Checkbox";
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

const FormControlLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  vertical-align: middle;
  margin-left: -11px;
  margin-right: 16px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
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
      <FormControlLabel>
        <Checkbox
          defaultChecked={!!defaultValue}
          onChange={(e) => setChecked(e.target.checked)}
          name={`paymentPreference.${id}`}
        />
        <span>{paymentLabelsById[id]}</span>
      </FormControlLabel>
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
            <FormGroup>
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
