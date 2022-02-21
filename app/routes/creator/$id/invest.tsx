import { useCallback, useState } from "react";
import getMeta from "~/_common/getMeta";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import PaymentPreference from "~/_common/PaymentPreferences";
import type { Handler as PutHandler } from "../../../../functions/agreement/put";
import type { Handler as GetHandler } from "../../../../functions/agreement/get";
import {
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useNavigate,
} from "remix";
import axios from "axios";
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
import formatAmount from "../../../../db/util/formatAmount";

type Data = Awaited<ReturnType<GetHandler>>;

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
  height: 30px;
  display: flex;
  align-items: center;
`;


const TextfieldHorizontalBox = styled.div`
  justify-content: flex-start;
  grid-gap: 10px;
  display: flex;
  align-items: flex-end;
`

const EnterDetails = () => {
  const state = useLoaderData<Data>();
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
      .then(({ uuid }) => navigate(`/contract?uuid=${uuid}&signer=1`))
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
    navigate,
  ]);

  return (
    <>
      <BackButton onClick={() => navigate(`/creator/${state.userId}`)}>
        <Icon heightAndWidth={"20px"} name={"backArrow"} />
        Go Back
      </BackButton>
      <TopBarProfile>
        <TermSheetTitleBox>
          <ProfileTitle>Summary {"&"} Your Details</ProfileTitle>
          <PrimaryAction
            label={
              <IconContent>
                <Icon
                  heightAndWidth={"20px"}
                  name={error ? "repeat" : "edit"}
                  color={"white"}
                />
                <span>{error ? error : "Read and Sign Term Sheet"}</span>
              </IconContent>
            }
            onClick={onSign}
            height={"44px"}
            fontSize={"16px"}
            isLoading={loading}
            bgColor={error && "warning"}
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
                    I agree to contribute{" "}
                    <b>
                      $
                      {formatAmount(
                        Number(amount) / (Number(state.details.frequency) || 1)
                      )}
                    </b>{" "}
                    paid out as a monthly stipend for{" "}
                    <b>
                      {state.details.frequency || 1} month
                      {state.details.frequency === "1" ? "" : "s"}
                    </b>
                    .
                  </ExplainText>
                </ExplainContent>
                <CheckBox />
              </ExplainBox>
              <TextFieldBox>
                <TextInputContainer width={"350px"}>
                  {<InputMetrix>$</InputMetrix>}
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
                  <ExplainTitle>How much they raise</ExplainTitle>
                  <ExplainText>
                    They agree to request a total of paid out as a monthly
                    stipend of $
                    {formatAmount(
                      Number(amount) / (Number(state.details.frequency) || 1)
                    )}{" "}
                    per month for {Number(state.details.frequency) || 1} month
                    {state.details.frequency === "1" ? "" : "s"}.
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
                    They agreed to pay back a dividend capped at{" "}
                    {formatAmount(state.details.return)}%, or a total or $
                    {formatAmount(
                      (Number(state.details.amount) *
                        (Number(state.details.frequency) || 1) *
                        Number(state.details.return)) /
                      100
                    )}{" "}
                    to their investors. By investing a total of ${amount},
                    you’ll receive a maximum amount of $
                    {formatAmount(
                      (Number(amount) * Number(state.details.return)) / 100
                    )}
                    .
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
                    They agreed to take {formatAmount(state.details.share)}% of
                    all their total revenue, including pre-existing assets, once
                    they hit $
                    {formatAmount(Number(state.details.threshold) / 12)} per
                    month or ${formatAmount(Number(state.details.threshold))}{" "}
                    per year. Your share of these {state.details.share}% is
                    proportional to the investment sum:{" "}
                    {formatAmount(
                      (Number(state.details.share) * Number(amount)) /
                      (Number(state.details.amount) *
                        (Number(state.details.frequency) || 1))
                    )}
                    %.
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
                    This agreement is valid for{" "}
                    {formatAmount(state.details.cap)} years. Any amount that has
                    not been paid back until then, does not have to be paid back
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
          <TextfieldHorizontalBox>
            <TextFieldBox>
              <TextFieldDescription>Address</TextFieldDescription>
              <TextFieldDescription $small required>
                Street
              </TextFieldDescription>
              <TextInputContainer width={"270px"}>
                <TextInputOneLine
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription $small required>
                No
              </TextFieldDescription>
              <TextInputContainer width={"80px"}>
                <TextInputOneLine
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </TextInputContainer>
            </TextFieldBox>
          </TextfieldHorizontalBox>
          <TextfieldHorizontalBox>
            <TextFieldBox>
              <TextFieldDescription $small>City</TextFieldDescription>
              <TextInputContainer width={"270px"}>
                <TextInputOneLine
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  required
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription $small>ZIP</TextFieldDescription>
              <TextInputContainer width={"80px"}>
                <TextInputOneLine
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  required
                />
              </TextInputContainer>
            </TextFieldBox>
          </TextfieldHorizontalBox>
          <TextFieldBox>
            <TextFieldDescription>Address</TextFieldDescription>
            <TextFieldDescription $small required>
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
            <TextFieldDescription $small>City & ZIP</TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                required
              />
            </TextInputContainer>
          </TextFieldBox>
          <TextFieldBox>
            <TextFieldDescription $small required>
              Registered Country
            </TextFieldDescription>
            <TextInputContainer
              width={"350px"}
            >
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
                <Icon heightAndWidth={"20px"} name={"edit"} color={"white"} />{" "}
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

export const loader: LoaderFunction = ({ params, request }) =>
  axios
    .get<Data>(
      `${process.env.API_URL}/agreement${new URL(request.url).search}&userId=${params["id"]
      }`
    )
    .then((r) => r.data);

export const meta: MetaFunction = (args) =>
  getMeta({
    title: "Invest", // args.data.fullName,
  })(args);

export default EnterDetails;
