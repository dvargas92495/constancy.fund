import { useMemo, useState } from "react";
import getMeta from "~/_common/getMeta";
import PaymentPreference from "~/_common/PaymentPreferences";
import getAgreement from "~/data/getAgreement.server";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import CheckBox from "@mui/material/Checkbox";
import CountrySelect from "~/_common/CountrySelect";

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
import { IconContent, ProfileTitle, TopBarProfile } from "../$id";
import formatAmount from "../../../util/formatAmount";
import createAgreement from "~/data/createAgreement.server";
import ErrorSnackbar from "~/_common/ErrorSnackbar";
import validatePaymentPreferences from "~/data/validatePaymentPreferences";
import { LoadingIndicator } from "~/_common/LoadingIndicator";

type Data = Awaited<ReturnType<typeof getAgreement>>;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

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

const TextfieldHorizontalBox = styled.div`
  justify-content: flex-start;
  grid-gap: 10px;
  display: flex;
  align-items: flex-end;
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

const ProfileContainer = styled(Form)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
`;

const ContainerWithInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 20px;
`;

const InvestorPrimaryAction = () => {
  const actionData = useActionData();
  return (
    <PrimaryAction
      label={
        <IconContent>
          <Icon heightAndWidth={"20px"} name={"edit"} color={"white"} />
          <span>{actionData?.error || "Read and Sign Term Sheet"}</span>
        </IconContent>
      }
      type={"submit"}
      height={"44px"}
      fontSize={"16px"}
    />
  );
};

const LoadingScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
`;

const EnterDetails = () => {
  const state = useLoaderData<Data>();
  const [amount, setAmount] = useState(state.amount);
  const transition = useTransition();
  const showLoadingScreen = useMemo(
    () => transition.state === "submitting",
    [transition.state]
  );
  return showLoadingScreen ? (
    <LoadingScreenContainer id={"wait-contract-generated"}>
      <h3>Please wait while your contract is being generated...</h3>
      <LoadingIndicator size="20px" thickness={3} />
    </LoadingScreenContainer>
  ) : (
    <ProfileContainer method={"post"}>
      <Link to={`/creator/${state.user.id}`}>
        <BackButton>
          <Icon heightAndWidth={"20px"} name={"backArrow"} />
          Go Back
        </BackButton>
      </Link>
      <TopBarProfile>
        <TermSheetTitleBox>
          <ProfileTitle>Summary {"&"} Your Details</ProfileTitle>
          <InvestorPrimaryAction />
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
                  <ExplainTitle>
                    How much you back this project with
                  </ExplainTitle>
                  <ExplainText>
                    I agree to contribute{" "}
                    <b>
                      $
                      {formatAmount(
                        amount / Number(state.details.frequency || 1)
                      )}
                    </b>{" "}
                    {state.details.supportType === "monthly" && (
                      <>
                        paid out as a monthly stipend for{" "}
                        <b>
                          {state.details.frequency || 1} month
                          {state.details.frequency === "1" ? "" : "s"}
                        </b>
                      </>
                    )}
                    .
                  </ExplainText>
                </ExplainContent>
              </ExplainBox>
              <TextFieldBox>
                <ContainerWithInfo>
                  <TextInputContainer width={"350px"}>
                    {<InputMetrix>$</InputMetrix>}
                    <TextInputOneLine
                      defaultValue={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      type={"number"}
                      placeholder={"100"}
                      name={"amount"}
                      min={100}
                      // TODO set max
                    />
                  </TextInputContainer>
                  <InfoPill>
                    <InfoPillTitle>Your maximium return</InfoPillTitle>
                    <InfoPillInfo>
                      $
                      {formatAmount(
                        Math.floor(
                          (Number(amount) * Number(state.details.return || 0)) /
                            100
                        )
                      )}
                    </InfoPillInfo>
                  </InfoPill>
                </ContainerWithInfo>
              </TextFieldBox>
            </ExplainMeLikeIamFiveContainer>

            {state.details.supportType === "monthly" && (
              <ExplainMeLikeIamFiveContainer>
                <ExplainBox>
                  <ExplainContent>
                    <ExplainTitle>
                      Paying monthly stipend as one-time-payment
                    </ExplainTitle>
                    <ExplainText>
                      I acknowledge that I can pay my monthly stipend as a
                      one-time-payment. In case the project cancels the monthly
                      stipend early, they have 30 days to return the excess
                      payments and are not obliged to pay dividends on those.
                    </ExplainText>
                  </ExplainContent>
                  <CheckBox name={"term"} required />
                </ExplainBox>
              </ExplainMeLikeIamFiveContainer>
            )}
          </ExplainContainer>
        </Section>
        <Section>
          <SubSectionTitle>What the project is signing</SubSectionTitle>
          <ExplainContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How much they raise</ExplainTitle>
                  <ExplainText>
                    They agree to request a total of{" "}
                    <b>${formatAmount(Number(state.details.amount))}</b> from
                    all their backers{" "}
                    {state.details.supportType === "monthly" ? (
                      <>
                        , paid out as a monthly stipend of $
                        {formatAmount(
                          Number(amount) /
                            (Number(state.details.frequency) || 1)
                        )}{" "}
                        per month for {Number(state.details.frequency) || 1}{" "}
                        months.
                        {state.details.frequency === "1" ? "" : "s"}.
                      </>
                    ) : (
                      <>paid out as a one-time payment.</>
                    )}
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How much they pay back</ExplainTitle>
                  <ExplainText>
                    They agreed to pay back{" "}
                    <b>{formatAmount(state.details.return)}%</b>, or a total of{" "}
                    <b>
                      $
                      {formatAmount(
                        (Number(state.details.amount) *
                          (Number(state.details.frequency) || 1) *
                          Number(state.details.return)) /
                          100
                      )}
                    </b>{" "}
                    to their backers. By contributing a total of{" "}
                    <b>${amount ? Number(amount) : "_____"}</b>, you’ll receive
                    a maximum amount of{" "}
                    <b>
                      $
                      {formatAmount(
                        (Number(amount) * Number(state.details.return)) / 100
                      )}
                    </b>
                    .
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>What they pay back</ExplainTitle>
                  <ExplainText>
                    They agreed to take{" "}
                    <b>{formatAmount(state.details.share)}%</b> of all their
                    total revenue, including from pre-existing assets, once they
                    hit{" "}
                    <b>
                      $
                      {formatAmount(
                        Math.floor(Number(state.details.threshold) / 12)
                      )}{" "}
                      per month
                    </b>{" "}
                    or{" "}
                    <b>
                      ${formatAmount(Number(state.details.threshold))} per year
                    </b>
                    . Your share of these <b>{state.details.share}%</b> is
                    proportional to the contributed amount:{" "}
                    <b>
                      {formatAmount(
                        (Number(state.details.share) * Number(amount)) /
                          (Number(state.details.amount) *
                            (Number(state.details.frequency) || 1))
                      )}
                      %
                    </b>
                    .
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How long they pay back</ExplainTitle>
                  <ExplainText>
                    This agreement is valid for{" "}
                    <b>{formatAmount(state.details.cap)} years</b>. Any amount
                    that has not been paid back until then, does not have to be
                    paid back anymore.
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>How they inform</ExplainTitle>
                  <ExplainText>
                    They agree to update their backers <b>on a monthly basis</b>{" "}
                    about their income and to{" "}
                    <b>provide their tax returns yearly</b>.
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
              </ExplainBox>
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainBox>
                <ExplainContent>
                  <ExplainTitle>When they pay back</ExplainTitle>
                  <ExplainText>
                    They agree to start paying back my backers latest{" "}
                    <b>3 months</b> after they hit their revenue treshold.
                  </ExplainText>
                </ExplainContent>
                <CheckBox name={"term"} required />
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
                defaultValue={state.name}
                required
                name={"name"}
              />
            </TextInputContainer>
          </TextFieldBox>
          <TextFieldBox>
            <TextFieldDescription required>Email Address</TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                defaultValue={state.email}
                required
                name={"email"}
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
                <TextInputOneLine required name={"investorAddressStreet"} />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription $small required>
                No
              </TextFieldDescription>
              <TextInputContainer width={"80px"}>
                <TextInputOneLine name={"investorAddressNumber"} required />
              </TextInputContainer>
            </TextFieldBox>
          </TextfieldHorizontalBox>
          <TextfieldHorizontalBox>
            <TextFieldBox>
              <TextFieldDescription $small>City</TextFieldDescription>
              <TextInputContainer width={"270px"}>
                <TextInputOneLine name={"investorAddressCity"} required />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription $small>ZIP</TextFieldDescription>
              <TextInputContainer width={"80px"}>
                <TextInputOneLine name={"investorAddressZip"} required />
              </TextInputContainer>
            </TextFieldBox>
          </TextfieldHorizontalBox>
          <TextFieldBox>
            <TextFieldDescription $small required>
              Registered Country
            </TextFieldDescription>
            <TextInputContainer width={"350px"}>
              <CountrySelect name={"investorAddressCountry"} />
            </TextInputContainer>
          </TextFieldBox>
        </Section>
        <Section>
          <PaymentPreference />
        </Section>
        <BottomBar id={"bottom-bar"}>
          <InvestorPrimaryAction />
        </BottomBar>
      </ProfileBottomContainer>
      <ErrorSnackbar />
    </ProfileContainer>
  );
};

export const loader: LoaderFunction = ({ params, request }) => {
  const searchParams = new URL(request.url).searchParams;
  return getAgreement({
    userId: params["id"] || "",
    fundraise: searchParams.get("fundraise") || undefined,
    agreement: searchParams.get("agreement") || undefined,
  });
};

export const action: ActionFunction = ({ params, request }) => {
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
      if (!data.name?.[0]) throw new Error("`name` is required");
      else if (!data.email?.[0]) throw new Error("`email` is required");
      else if (!data.amount?.[0]) throw new Error("`amount` is required");
      else if (Number(data.amount[0]) < 100)
        throw new Error("`amount` must be at least $100");
      else if (!data.investorAddressStreet?.[0])
        throw new Error("`investorAddressNumber` is required");
      else if (!data.investorAddressNumber?.[0])
        throw new Error("`investorAddressNumber` is required");
      else if (!data.investorAddressCity?.[0])
        throw new Error("`investorAddressCity` is required");
      else if (!data.investorAddressZip?.[0])
        throw new Error("`investorAddressZip` is required");
      else if (!data.investorAddressCountry?.[0])
        throw new Error("`investorAddressCountry` is required");

      const paymentPreferences = validatePaymentPreferences(data);
      const searchParams = new URL(request.url).searchParams;

      return createAgreement({
        name: data.name[0],
        amount: Number(data.amount[0]),
        email: data.email[0],
        uuid: searchParams.get("agreement") || undefined,
        contractUuid: searchParams.get("fundraise") || undefined,
        userId: params.id || "",
        investorAddressStreet: data.investorAddressStreet[0],
        investorAddressNumber: data.investorAddressNumber[0],
        investorAddressCity: data.investorAddressCity[0],
        investorAddressZip: data.investorAddressZip[0],
        investorAddressCountry: data.investorAddressCountry[0],
        paymentPreferences,
      }).then(({ uuid }) => redirect(`/contract?uuid=${uuid}&signer=1`));
    })
    .catch((e) => {
      console.error(e);
      return { success: false, error: e.message };
    });
};

export const meta: MetaFunction = (args) =>
  getMeta({
    title: "Invest", // args.data.fullName,
  })(args);

export default EnterDetails;
