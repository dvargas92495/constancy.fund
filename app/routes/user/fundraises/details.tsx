import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Body from "@dvargas92495/ui/dist/components/Body";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import type { Handler as ContractHandler } from "../../../../functions/contract/post";
import FUNDRAISE_TYPES from "../../../../db/fundraise_types";
import {
  useLocation,
  useNavigate,
} from "remix";
import formatAmount from "../../../../db/util/formatAmount";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import SectionCircle from "~/_common/SectionCircle";
import InfoText from "~/_common/InfoText";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import SubSectionTitle from "~/_common/SubSectionTitle";
import TextInputMultiLine from "~/_common/TextInputMultiLine";

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

type DetailProps = {
  data: Record<string, string>;
  setData: (e: Record<string, string>) => void;
};

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

const ISADetailForm = ({ data, setData }: DetailProps) => {
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    setData({
      ...data,
      [target.name]: target.value,
    });
  };

  return (
    <>
      <Section>
        <SubSectionTitle>How do you want to raise?</SubSectionTitle>
        <HowMuchSubSection>
          <RadioGroup
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
            name="supportType"
            value={data["supportType"]}
            onChange={onChange}
          >
            {ISA_SUPPORT_TYPES.map(({ label, value, description }) => (
              <Radio
                key={value}
                value={value}
                disableRipple
                sx={{
                  "&:hover": {
                    background: "none",
                  },
                  "& .MuiTouchRipple": {
                    display: "none",
                  },
                  "& .Mui-checked": {
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "black",
                  },
                  width: "50%",
                  padding: 0,
                }}
                checkedIcon={
                  <SupportTypeCard active={true}>
                    <SectionCircle margin={"0"} width={"40px"} height={"40px"}>
                      <Icon
                        name={"home"}
                        heightAndWidth="18px"
                        color="purple"
                      />
                    </SectionCircle>
                    <SupportTypeContentBox>
                      <SupportTypeTitle>{label}</SupportTypeTitle>
                      <SupportTypeDescription>
                        {description}
                      </SupportTypeDescription>
                    </SupportTypeContentBox>
                  </SupportTypeCard>
                }
                icon={
                  <SupportTypeCard>
                    <SectionCircle margin={"0"} width={"40px"}>
                      <Icon
                        name={"home"}
                        heightAndWidth="18px"
                        color="darkerText"
                      />
                    </SectionCircle>
                    <SupportTypeContentBox>
                      <SupportTypeTitle>{label}</SupportTypeTitle>
                      <SupportTypeDescription>
                        {description}
                      </SupportTypeDescription>
                    </SupportTypeContentBox>
                  </SupportTypeCard>
                }
              />
            ))}
          </RadioGroup>
        </HowMuchSubSection>

        <HowMuchSetValuesSection>
          {data["supportType"] !== undefined && (
            <TextFieldBox>
              <TextFieldDescription required>
                Amount you'd like to raise
              </TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  type={"number"}
                  name={"amount"}
                  value={data["amount"]}
                  onChange={onChange}
                />
                {data["supportType"] === "monthly" ? (
                  <InputMetrix>$ per month</InputMetrix>
                ) : (
                  <InputMetrix>$</InputMetrix>
                )}
              </TextInputContainer>
            </TextFieldBox>
          )}
          {data["supportType"] === "monthly" && (
            <>
              <TextFieldBox>
                <TextFieldDescription required>
                  For how many months?
                </TextFieldDescription>
                <TextInputContainer>
                  <TextInputOneLine
                    type={"number"}
                    name={"frequency"}
                    value={data["frequency"]}
                    onChange={onChange}
                  />
                </TextInputContainer>
              </TextFieldBox>
            </>
          )}
        </HowMuchSetValuesSection>
        {Number(data["amount"]) > 0 && (
          <TextFieldBox>
            <InfoPill>
              <InfoPillTitle>Total Funding Request</InfoPillTitle>
              <InfoPillInfo>
                $
                {formatAmount(
                  (Number(data["amount"]) || 0) *
                    (Number(data["frequency"]) || 1)
                )}
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
                value={data["return"]}
                onChange={onChange}
              />
              {<InputMetrix>%</InputMetrix>}
            </TextInputContainer>
            <InfoPill>
              <InfoPillTitle>Maximum Return</InfoPillTitle>
              <InfoPillInfo>
                $
                {formatAmount(
                  ((Number(data["return"]) || 0) / 100) *
                    (Number(data["amount"]) || 0) *
                    (Number(data["frequency"]) || 1)
                )}
              </InfoPillInfo>
            </InfoPill>
          </ContainerWithInfo>
        </TextFieldBox>
        <TextFieldBox>
          <TextFieldDescription required>
            Income/Revenue Payback Threshold
          </TextFieldDescription>
          <ContainerWithInfo>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                type={"number"}
                name={"threshold"}
                value={data["threshold"]}
                onChange={onChange}
              />
              {<InputMetrix>$</InputMetrix>}
            </TextInputContainer>
            <InfoPill>
              <InfoPillTitle>ø per month</InfoPillTitle>
              <InfoPillInfo>
                ${formatAmount((Number(data["threshold"]) || 0) / 12)} / month
              </InfoPillInfo>
            </InfoPill>
          </ContainerWithInfo>
        </TextFieldBox>
        <TextFieldBox>
          <TextFieldDescription required>
            Share of revenue used for payback
          </TextFieldDescription>
          <TextInputContainer>
            <TextInputOneLine
              type={"number"}
              name={"share"}
              value={data["share"]}
              onChange={onChange}
            />
            {<InputMetrix>%</InputMetrix>}
          </TextInputContainer>
        </TextFieldBox>
        <TextFieldBox>
          <TextFieldDescription required>Time Cap</TextFieldDescription>
          <TextInputContainer>
            <TextInputOneLine
              type={"number"}
              name={"cap"}
              value={data["cap"]}
              onChange={onChange}
            />
            {<InputMetrix>years</InputMetrix>}
          </TextInputContainer>
        </TextFieldBox>
      </Section>
      <Section>
        <SubSectionTitle>Additional Contract Clauses</SubSectionTitle>
        <InfoText>
          Do you have any special requirements in this contract that you'd like
          to add? It is <b>strongly</b> advised to cross-check these terms with
          a legal professional.
        </InfoText>
        <TextInputContainer width={"600px"}>
          <TextInputMultiLine
            name={"clauses"}
            value={data["clauses"]}
            onChange={onChange}
          />
        </TextInputContainer>
      </Section>
    </>
  );
};

const NoForm = () => {
  return <Box>Coming Soon...</Box>;
};

const FUNDRAISE_DETAIL_FORMS: {
  [k in typeof FUNDRAISE_TYPES[number]["id"]]: (
    p: DetailProps
  ) => React.ReactElement;
} = {
  isa: ISADetailForm,
  loan: NoForm,
  safe: NoForm,
  saft: NoForm,
};

const UserFundraiseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contractHandler = useAuthenticatedHandler<ContractHandler>({
    path: "contract",
    method: "POST",
  });
  const [data, setData] = useState<Record<string, string>>({});
  const id = useMemo(
    () =>
      ((location.state as { id?: string })
        ?.id as keyof typeof FUNDRAISE_DETAIL_FORMS) || "isa",
    []
  );
  const DetailForm = useMemo(() => FUNDRAISE_DETAIL_FORMS[id], [id]);
  return (
    <>
      <TopBar>
        <InfoArea>
          <PageTitle>Define Contract Terms</PageTitle>
          <PrimaryAction
            onClick={(e) => {
              setLoading(true);
              contractHandler({ data, id })
                .then((state) =>
                  navigate(`/user/fundraises/preview/${state.id}`, {
                    state: { initialCreate: true },
                  })
                )
                .catch((e) => {
                  setError(e.message);
                  setLoading(false);
                });
              e.preventDefault();
            }}
            isLoading={loading}
            label={"Save & Preview Contract"}
          />
        </InfoArea>
      </TopBar>
      <ContentContainer>
        <DetailForm data={data} setData={setData} />
        <Body sx={{ color: "error" }}>{error}</Body>
      </ContentContainer>
    </>
  );
};

export default UserFundraiseDetails;
