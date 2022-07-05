import { useEffect, useState } from "react";
import styled from "styled-components";
import formatAmount from "../../../../util/formatAmount";
import Icon from "~/_common/Icon";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import Section from "~/_common/Section";
import SectionCircle from "~/_common/SectionCircle";
import InfoText from "~/_common/InfoText";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import SubSectionTitle from "~/_common/SubSectionTitle";
import TextInputMultiLine from "~/_common/TextInputMultiLine";
import ErrorSnackbar from "~/_common/ErrorSnackbar";
import { redirect, ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import createFundraise from "~/data/createFundraise.server";
import type { FundraiseId } from "../../../../enums/fundraiseTypes";
import { v4 } from "uuid";
import { SecondaryAction } from "~/_common/SecondaryAction";
import { PrimaryAction } from "~/_common/PrimaryAction";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
import RadioGroup from "~/_common/RadioGroup";
import { useDashboardActions } from "~/_common/DashboardActionContext";

const ISA_SUPPORT_TYPES = [
  {
    label: "Monthly Stipend",
    description: "Get a monthly payout & cancel anytime",
    value: "monthly",
  },
  {
    label: "One-time Payout",
    description: "Get a one-time payment from your supporters",
    value: "once",
  },
];

const SupportTypeCard = styled.div<{ active?: boolean }>`
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-direction: row !important;
  border: ${(props) =>
    props.active
      ? "1px solid" + props.theme.palette.color.purple
      : "1px solid" + props.theme.palette.color.lightgrey};
  border-radius: 8px;
  padding: 15px 20px;
  grid-gap: 15px;
`;

const SupportTypeContentBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  grid-gap: 5px;
  flex: 1;
`;

const SupportTypeTitle = styled.div`
  display: flex;
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: bold;
  font-size: 16px;
`;

const SupportTypeDescription = styled.div`
  display: flex;
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 300;
  font-size: 14px;
`;

const InputMetrix = styled.span`
  white-space: nowrap;
  width: 100px;
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 14px;
  text-align: center;
  padding: 0 10px;
`;

const HowMuchSubSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    grid-gap: 10px;
    flex-wrap: nowrap;
  }
`;

const HowMuchSetValuesSection = styled.div`
  margin: 40px 0px;
`;

const InfoPillTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  color: ${(props) => props.theme.palette.color.primary};
`;

const InfoPillInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => props.theme.palette.color.purple};
`;

const InfoPill = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.theme.palette.color.backgroundColorDarkerDarker};
  padding: 0px 20px;
  height: 40px;
  width: fit-content;
  border-radius: 50px;
  grid-gap: 5px;
`;

const ContainerWithInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 20px;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 20px;
`;

const ThresholdField = () => {
  const [threshold, setThreshold] = useState(0);
  return (
    <TextFieldBox>
      <TextFieldDescription required>
        Income/Revenue Payback Threshold
      </TextFieldDescription>
      <ContainerWithInfo>
        <TextInputContainer width={"350px"}>
          <TextInputOneLine
            type={"number"}
            required
            name={"threshold"}
            onChange={(e) => setThreshold(Number(e.target.value) || 0)}
          />
          {<InputMetrix>$</InputMetrix>}
        </TextInputContainer>
        <InfoPill>
          <InfoPillTitle>ø per month</InfoPillTitle>
          <InfoPillInfo>${formatAmount(threshold / 12)} / month</InfoPillInfo>
        </InfoPill>
      </ContainerWithInfo>
    </TextFieldBox>
  );
};

const AdditionalClause = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdditionalClauses = () => {
  const [clauses, setClauses] = useState<string[]>([]);
  return (
    <>
      {clauses.map((uuid) => (
        <AdditionalClause key={uuid}>
          <TextInputContainer width={"600px"}>
            <TextInputMultiLine name={"clauses"} required />
          </TextInputContainer>
          {clauses.length > 1 && (
            <Icon
              name={"delete"}
              onClick={() => setClauses(clauses.filter((c) => c !== uuid))}
            />
          )}
        </AdditionalClause>
      ))}
      <SecondaryAction
        label={
          <span>
            Add Clause <Icon name={"add"} />
          </span>
        }
        onClick={() => {
          setClauses([...clauses, v4()]);
        }}
      />
    </>
  );
};

const _RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const ISADetailForm = () => {
  const [supportType, setSupportType] = useState("");
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState(1);
  const [maxReturn, setMaxReturn] = useState(0);
  const total = amount * frequency;
  const { setShowPrimary, setShowSecondary } = useDashboardActions();
  useEffect(() => {
    setShowPrimary(true);
    setShowSecondary(true);
  }, [setShowPrimary, setShowSecondary]);
  return (
    <Form method={"post"}>
      <Section>
        <SubSectionTitle>How do you want to raise?</SubSectionTitle>
        <HowMuchSubSection>
          <RadioGroup
            options={ISA_SUPPORT_TYPES}
            name={"supportType"}
            onChange={setSupportType}
            defaultValue={""}
            renderItem={({ active, label, description }) => (
              <SupportTypeCard active={active}>
                <SectionCircle margin={"0"} width={"40px"} height={"40px"}>
                  <Icon
                    name={"home"}
                    heightAndWidth="18px"
                    color={active ? "purple" : "darkerText"}
                  />
                </SectionCircle>
                <SupportTypeContentBox>
                  <SupportTypeTitle>{label}</SupportTypeTitle>
                  <SupportTypeDescription>{description}</SupportTypeDescription>
                </SupportTypeContentBox>
              </SupportTypeCard>
            )}
          />
        </HowMuchSubSection>

        <HowMuchSetValuesSection>
          {supportType && (
            <TextFieldBox>
              <TextFieldDescription required>
                Amount you&apos;d like to raise
              </TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  type={"number"}
                  name={"amount"}
                  min={100}
                  required
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />
                {supportType === "monthly" ? (
                  <InputMetrix>$ per month</InputMetrix>
                ) : (
                  <InputMetrix>$</InputMetrix>
                )}
              </TextInputContainer>
            </TextFieldBox>
          )}
          {supportType === "monthly" && (
            <>
              <TextFieldBox>
                <TextFieldDescription required>
                  For how many months?
                </TextFieldDescription>
                <TextInputContainer>
                  <TextInputOneLine
                    required
                    type={"number"}
                    name={"frequency"}
                    min={12}
                    onChange={(e) => setFrequency(Number(e.target.value) || 1)}
                  />
                </TextInputContainer>
              </TextFieldBox>
            </>
          )}
        </HowMuchSetValuesSection>
        {amount > 0 && (
          <TextFieldBox>
            <InfoPill>
              <InfoPillTitle>Total Funding Request</InfoPillTitle>
              <InfoPillInfo>
                ${formatAmount(amount * frequency)}
                .00
              </InfoPillInfo>
            </InfoPill>
          </TextFieldBox>
        )}
      </Section>
      <Section>
        <SubSectionTitle>How do you want to raise?</SubSectionTitle>
        <TextFieldBox>
          <TextFieldDescription required>
            Maximum return for investors
          </TextFieldDescription>
          <ContainerWithInfo>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                type={"number"}
                name={"return"}
                required
                onChange={(e) => setMaxReturn(Number(e.target.value) || 0)}
                min={100}
              />
              {<InputMetrix>%</InputMetrix>}
            </TextInputContainer>
            <InfoPill>
              <InfoPillTitle>Maximum Return</InfoPillTitle>
              <InfoPillInfo>
                ${formatAmount((maxReturn / 100) * total)}
              </InfoPillInfo>
            </InfoPill>
          </ContainerWithInfo>
        </TextFieldBox>
        <ThresholdField />
        <TextFieldBox>
          <TextFieldDescription required>
            Share of revenue used for payback
          </TextFieldDescription>
          <TextInputContainer>
            <TextInputOneLine
              type={"number"}
              name={"share"}
              required
              min={1}
              max={100}
            />
            {<InputMetrix>%</InputMetrix>}
          </TextInputContainer>
        </TextFieldBox>
        <TextFieldBox>
          <TextFieldDescription required>Time Cap</TextFieldDescription>
          <TextInputContainer>
            <TextInputOneLine type={"number"} name={"cap"} required min={1} />
            {<InputMetrix>years</InputMetrix>}
          </TextInputContainer>
        </TextFieldBox>
      </Section>
      <Section>
        <SubSectionTitle>Additional Contract Clauses</SubSectionTitle>
        <InfoText>
          Do you have any special requirements in this contract that you&apos;d
          like to add? It is <b>strongly</b> advised to cross-check these terms
          with a legal professional.
        </InfoText>
        <AdditionalClauses />
      </Section>
      <ErrorSnackbar />
    </Form>
  );
};

export const action: ActionFunction = ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        return new Response("No valid user found", { status: 401 });
      }
      const formData = await request.formData();
      const data = Object.fromEntries(
        Array.from(formData.keys()).map((k) => [
          k,
          formData.getAll(k).map((v) => v as string),
        ])
      );
      if (!data.supportType[0]) throw new Error("`supportType` is required");
      else if (!data.amount[0]) throw new Error("`amount` is required");
      else if (Number(data.amount[0]) < 100)
        throw new Error("`amount` must be at least $100");
      else if (data.supportType[0] === "monthly" && !data.frequency[0])
        throw new Error(
          "`frequency` is required when `supportType` is monthly."
        );
      else if (
        data.supportType[0] === "monthly" &&
        Number(data.frequency[0]) < 12
      )
        throw new Error(
          "`frequency` must be at least 12 months when `supportType` is monthly."
        );
      else if (!data.return[0]) throw new Error("`total` is required");
      else if (Number(data.return[0]) < 100)
        throw new Error("`return` must be at least 100% ot the amount raised.");
      else if (!data.share[0]) throw new Error("`share` is required");
      else if (Number(data.share[0]) < 1)
        throw new Error("`share` must be at least 1%");
      else if (Number(data.share[0]) > 100)
        throw new Error("`share` must be at most 100%");
      else if (!data.cap[0]) throw new Error("`cap` is required");
      else if (Number(data.cap[0]) < 1)
        throw new Error("`cap` must be at least 1 year");
      return createFundraise({
        userId,
        data,
        id: new URL(request.url).pathname
          .split("/")
          .slice(-1)[0] as FundraiseId,
      }).then((uuid) => redirect(`/user/fundraises/${uuid}/preview`));
    })
    .catch((e) => {
      console.error(e);
      return { success: false, error: e.message };
    });
};

export const handle = {
  title: "Create New ISA Fundraise",
  primaryLabel: "Create",
  secondaryLabel: "Back",
  onSecondary: () => window.location.assign("/user/fundraises"),
};

export default ISADetailForm;
