import { useCallback, useState } from "react";
import { getMeta } from "~/_common/Layout";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import PaymentPreference from "~/_common/PaymentPreferences";
import type { Handler as PutHandler } from "../../../../functions/agreement/put";
import {
  //   LoaderFunction,
  MetaFunction,
  //   useLoaderData,
  useLocation,
  useNavigate,
} from "remix";
// import axios from "axios";
import CheckBox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CountryRegionData from "country-region-data";

import Icon from "~/_common/Icon";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import Spacer from "~/_common/Spacer";

import Section from "~/_common/Section";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import SectionTitle from "~/_common/SectionTitle";

import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import {
  IconContent,
  ProfileBottomContainer,
  ProfileTitle,
  TopBarProfile,
} from "../$id";
import type { Agreement } from "./index";

const TermSheetTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  padding-top: 130px;
  grid-gap: 15px;
`;

const BackButton = styled.div`
  display: flex;
  grid-gap: 5px;
  width: fit-content;
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 6px 12px;
  z-index: 1001;
  align-items: center;
  cursor: pointer;
`;

const ExplainTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`;

const ExplainContent = styled.div`
  grid-gap: 5px;
  display: flex;
  flex-direction: column;
`;

const ExplainText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.palette.text.tertiary};
  line-height: 21px;
`;

const ExplainMeLikeIamFiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  padding: 20px;
  grid-gap: 30px;
`;

const ExplainBox = styled.div`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  grid-gap: 30px;
  display: flex;
`;

const ExplainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  grid-gap: 10px;
  margin-bottom: 40px;

  & > div {
    width: fill-available;
  }
`;

const InputMetrix = styled.span`
  white-space: nowrap;
  width: 100px;
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 14px;
  text-align: center;
  padding: 0 10px;
  border-right: 2px solid ${(props) => props.theme.palette.color.lightgrey};
`;

const BottomBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 10px;
`;

const ErrorBox = styled.div`
  background: ${(props) => props.theme.palette.warning.main};
  border-radius: 8px;
  width: fit-content;
  padding: 5px 15px;
  color: white;
  height: 24px;
`;

const EnterDetails = () => {
  // TODO: load state from useLoaderData();
  const state = useLocation().state as Agreement & { userId: string };
  const navigate = useNavigate();
  const [name, setName] = useState(state.name || "");
  const [email, setEmail] = useState(state.email || "");
  const [amount, setAmount] = useState(state.amount || "");
  const [company, setCompany] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [address, setAddress] = useState("");
  const [paymentPreference, setPaymentPreference] = useState({ type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const putHandler = useHandler<PutHandler>({
    path: "agreement",
    method: "PUT",
  });
  const onSign = useCallback(() => {
    setLoading(true);
    setError("");
    putHandler({
      name,
      email,
      amount: Number(amount),
      uuid: state.uuid,
      contractUuid: state.contractUuid || "",
      investorAddress: address,
      investorCompany: company,
      investorCompanyType: companyType,
    })
      .then(({ uuid }) =>
        window.location.assign(`/contract?uuid=${uuid}&signer=1`)
      )
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [
    name,
    email,
    amount,
    state,
    setError,
    setLoading,
    address,
    company,
    companyType,
  ]);

  return (
    <>
      <BackButton onClick={() => navigate(`/creator/${state.userId}`)}>
        <Icon heightAndWidth={"20px"} name={"backArrow"} />
        Go Back
      </BackButton>
      <TopBarProfile>
        <TermSheetTitleBox>
          <ProfileTitle>Summary & Your Details</ProfileTitle>
          <PrimaryAction
            label={
              <IconContent>
                <Icon
                  heightAndWidth={"20px"}
                  name={error ? "repeat" : "dollar"}
                  color={"white"}
                />
                <span>{error ? error : "Read and Sign Term Sheet"}</span>
              </IconContent>
            }
            onClick={onSign}
            height={"44px"}
            fontSize={"16px"}
            isLoading={loading}
          />
        </TermSheetTitleBox>
      </TopBarProfile>
      <ProfileBottomContainer paddingTop={"20px"}>
        <Section>
          <SectionTitle>Terms Summary</SectionTitle>
          <InfoText>
            Please read the summaries carefully to know what you agree on, and
            check off the boxes to confirm. A full version of the contract is
            visible in the next step.
          </InfoText>
          <SubSectionTitle>What you are signing</SubSectionTitle>
          <ExplainContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How much you invest</ExplainTitle>
                  <ExplainText>
                    I agree to contribute with{" "}
                    <b>$ {amount ? amount : "_____"}</b> paid out as a monthly
                    stipend for <b>12 months</b>.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
              <TextFieldBox>
                <TextInputContainer width={"350px"}>
                  {<InputMetrix>$ per month</InputMetrix>}
                  <TextInputOneLine
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    type={"number"}
                    placeholder={"100"}
                  />
                </TextInputContainer>
              </TextFieldBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>
                    Paying monthly stipend as one-time-payment
                  </ExplainTitle>
                  <ExplainText>
                    I acknowledge that I can pay my monthly stipend as a
                    one-time-payment. In case the creator cancels the monthly
                    stipend early, they have 30 days to return the excess
                    payments and are not obliged to pay dividends on those.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
          </ExplainContainer>
        </Section>
        <Section>
          <SubSectionTitle>What the creator is signing</SubSectionTitle>
          <ExplainContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How much you raise</ExplainTitle>
                  <ExplainText>
                    They agree to request a total of paid out as a monthly
                    stipend of 3000€ per month for 12 months.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How much they pay back</ExplainTitle>
                  <ExplainText>
                    They agreed to pay back a dividend of 200%, or a total or
                    72.000€ to their investors. By investing a total of $3,600,
                    you’ll receive $7,200.{" "}
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>What they pay back</ExplainTitle>
                  <ExplainText>
                    They agreed to take 12% of all their total revenue,
                    including pre-existing assets, once they hit 3000€ per month
                    or €36.000 per year. Your share of these 12% is proportional
                    to the investment sum: 1.2%.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How long they pay back</ExplainTitle>
                  <ExplainText>
                    This agreement is valid for 8 years. Any amount that has not
                    been paid back until then, does not have to be paid back
                    anymore.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How they inform</ExplainTitle>
                  <ExplainText>
                    They agree to update investors on a monthly basis about
                    their income and to provide their tax returns yearly.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>When they pay back</ExplainTitle>
                  <ExplainText>
                    They agree to start paying back my investors latest 3 months
                    after they hit my revenue treshold.
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
          </ExplainContainer>
        </Section>
        <Section>
          <SectionTitle>Your Contact Details</SectionTitle>
          <Spacer height={"30px"} />
          <TextFieldBox>
            <TextFieldDescription required>Your Name</TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </TextInputContainer>
          </TextFieldBox>
          <TextFieldBox>
            <TextFieldDescription required>Email Address</TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </TextInputContainer>
          </TextFieldBox>
          <Spacer height={"10px"} />
          <TextFieldBox>
            <TextFieldDescription>Address</TextFieldDescription>
            <TextFieldDescription small required>
              Street
            </TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </TextInputContainer>
          </TextFieldBox>
          <TextFieldBox>
            <TextFieldDescription small>City & ZIP</TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                required
              />
            </TextInputContainer>
          </TextFieldBox>
          <TextFieldBox>
            <TextFieldDescription small required>
              Registered Country
            </TextFieldDescription>
            <TextInputContainer>
              <Select
                value={address}
                maxRows={10}
                MenuProps={{ sx: { maxHeight: 200 } }}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                required
              >
                {CountryRegionData.map((c) => (
                  <MenuItem value={c.countryName} key={c.countryShortCode}>
                    {c.countryName}
                  </MenuItem>
                ))}
              </Select>
            </TextInputContainer>
          </TextFieldBox>
        </Section>
        <Section>
          <SectionTitle>Payment Preferences</SectionTitle>
          <InfoText>
            Which payment options do have available for sending and receiving
            funds?
          </InfoText>
          <PaymentPreference
            value={paymentPreference}
            setValue={setPaymentPreference}
          />
        </Section>
        <BottomBar>
          {error && <ErrorBox>{error}</ErrorBox>}
          <PrimaryAction
            label={
              <IconContent>
                <Icon heightAndWidth={"20px"} name={"dollar"} color={"white"} />{" "}
                <span>Read and Sign Term Sheet</span>
              </IconContent>
            }
            onClick={onSign}
            height={"44px"}
            fontSize={"16px"}
            isLoading={loading}
          />
        </BottomBar>
      </ProfileBottomContainer>
    </>
  );
};

export const meta: MetaFunction = (args) =>
  getMeta({
    title: "Invest", // args.data.fullName,
  })(args);

export default EnterDetails;
