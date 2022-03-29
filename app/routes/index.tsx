import React, { useEffect, useState } from "react";
import getMeta from "~/_common/getMeta";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import axios from "axios";
import {
  ActionFunction,
  Form,
  useActionData,
  useCatch,
} from "remix";
import MainImage from "~/_common/Images/runner.svg";
import AutomateImage from "~/_common/Images/automate.svg";
import Icon from "~/_common/Icon";
import SuperPowerImage from "~/_common/Images/superpower.svg";
import { UserButton, useUser } from "@clerk/remix";

const LogoContainer = styled.img`
  position: absolute;
  top: 40px;
  left: 80px;
  height: 60px;
  width: 200px;
`;

const ButtonInnerDiv = styled.div`
  padding: 0 10px;
`;

const LoginButton = styled.a`
  padding: 10px 20px;
  text-decoration: none;
  &:active,
  &:visited,
  &:hover {
    color: inherit;
  }
`;

const UserContainer = styled.div`
  color: ${(props) => props.theme.palette.color.purple};
  font-size: 18px;
  font-weight: 800;
  position: absolute;
  right: 50px;
  top: 40px;
  cursor: pointer;
`;

const MainContentContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
  grid-gap: 100px;
  width: 90%;
`;

const IntroBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15%;
`;

const BigTitle = styled.div`
  font-size: 40px;
  color: ${(props) => props.theme.palette.color.purple};
  font-weight: 800;
  line-height: 50px;
  margin-bottom: 15px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 300;
`;

const BottomSignupContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  max-width: 800px;
  padding: 60px 30px;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  text-align: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 300px;
  border-radius: 12px;
`;

const BottomSignupTitle = styled.div`
  font-size: 24px;
  color: ${(props) => props.theme.palette.color.purple};
  font-weight: 900;
`;

const SignupBox = styled(Form)`
  margin-top: 30px;
  display: flex;
  align-items: center;
  grid-gap: 10px;
`;

const SignupFieldContainer = styled.input`
  border: 2px solid ${(props) => props.theme.palette.color.purple};
  font-weight: bold;
  text-transform: uppercase;
  height: 60px;
  width: 300px;
  text-align: center;
  border-radius: 8px;
  color: ${(props) => props.theme.palette.color.purple};

  &:focus::-webkit-input-placeholder {
    color: transparent;
  }

  &::placeholder {
    color: ${(props) => props.theme.palette.color.purple};
  }
`;

const MainImageContainer = styled.img`
  top: 25%;
  height: 60%;
  position: absolute;
  right: 10%;
`;

const FeatureBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 550px;
  grid-gap: 10px;
`;

const UseCaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 100px 0px 300px 0px;
`;
const UseCaseTitle = styled.div`
  font-weight: 900;
  font-size: 30px;
  color: ${(props) => props.theme.palette.color.normalText};
  text-align: center;
`;
const UseCasesExamples = styled.div`
  display: flex;
  align-items: flex-start;
  grid-gap: 30px;
  margin-top: 20px;
`;
const UseCaseExampleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  text-align: center;
`;
const UseCaseExampleTitle = styled.div`
  text-align: center;
  font-weight: 800;
  font-size: 20px;
  color: ${(props) => props.theme.palette.color.purple};
`;
const UseCaseExampleDescription = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: ${(props) => props.theme.palette.color.lighterText};
`;

const SuperpowerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  grid-gap: 0px;
  padding: 0 100px 0 50px;
  margin: 0 0 200px 0px;
`;
const SuperPowerImageContainer = styled.img`
  width: 80%;
  display: flex;
  margin-left: -350px;
`;
const SuperPowerTitle = styled.div`
  font-weight: 900;
  font-size: 30px;
  color: ${(props) => props.theme.palette.color.normalText};
`;
const HighlightText = styled.span`
  color: ${(props) => props.theme.palette.color.purple};
`;

const SuperPowerDescription = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: ${(props) => props.theme.palette.color.lighterText};
`;
const AutomateContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: center;
  grid-gap: 150px;
  margin: 0 0 200px 0px;
`;

const AutomateImageContainer = styled.img`
  top: 25%;
  height: 60%;
  width: 20%;
  display: flex;
`;

const AutomateTitle = styled.div`
  font-weight: 900;
  font-size: 30px;
  color: ${(props) => props.theme.palette.color.normalText};
`;
const AutomateDescription = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: ${(props) => props.theme.palette.color.lighterText};
`;
const TopContainer = styled.div`
  position: relative;
  padding: 0 5%;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  grid-gap: 150px;
`;
const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const ShortPitchSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  max-width: 1000px;
  justify-self: center;
  margin: 0 100px 200px 100px;
`;

const ShortPitchDescription = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: ${(props) => props.theme.palette.color.lighterText};
  text-align: center;
`;

const SubscribeConfirmBox = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.palette.color.purple};
  display: flex;
  align-items: center;
  grid-gap: 10px;
  height: 60px;
`;

const SubscribeBox = () => {
  const actionData = useActionData();
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    if (actionData?.success) setSubscribed(true);
  }, [actionData?.success]);

  return subscribed ? (
    <SubscribeConfirmBox>
      <Icon name="check" heightAndWidth="16px" />
      You're subscribed!
    </SubscribeConfirmBox>
  ) : (
    <SignupBox method="post">
      <SignupFieldContainer name="email" placeholder="Your Email" />
      <PrimaryAction
        height="60px"
        width="150px"
        label={<ButtonInnerDiv>GET UPDATES</ButtonInnerDiv>}
        type={"submit"}
        fontWeight={"600"}
      />
    </SignupBox>
  );
};

const Home: React.FC = () => {
  const { isSignedIn } = useUser();
  return (
    <RootContainer>
      <TopContainer>
        <LogoContainer src={"/svgs/constancy-logo.svg"} />
        <MainContentContainer>
          <IntroBox>
            <BigTitle>
              You don’t have to sell <br />
              your soul to get funded
            </BigTitle>
            <SubTitle>
              Crowdfunding for people and organisations that don’t want to sell
              equity.
            </SubTitle>
            <SubscribeBox />
          </IntroBox>
          <UserContainer>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <LoginButton href={"/login"}>LOGIN</LoginButton>
            )}
          </UserContainer>
        </MainContentContainer>
        <MainImageContainer src={MainImage} />
      </TopContainer>
      <ShortPitchSection>
        <UseCaseTitle>
          Selling equity is <HighlightText>not for everyone.</HighlightText>
        </UseCaseTitle>
        <ShortPitchDescription>
          Its hard getting to your initial capital if your company does not fit
          the growth expectations of Venture Capital investments or you don't
          want to sell equity because of conflicting company values.
        </ShortPitchDescription>
      </ShortPitchSection>
      <UseCaseContainer>
        <UseCaseTitle>
          <HighlightText>Who</HighlightText> is this for?
        </UseCaseTitle>
        <UseCasesExamples>
          <UseCaseExampleBox>
            <UseCaseExampleTitle>Indie Creators</UseCaseExampleTitle>
            <UseCaseExampleDescription>
              Raise a salary for your first months <br />& Give back with your
              future revenue.
            </UseCaseExampleDescription>
          </UseCaseExampleBox>
          <UseCaseExampleBox>
            <UseCaseExampleTitle>Small Businesses</UseCaseExampleTitle>
            <UseCaseExampleDescription>
              Can't get Venture Capital investments or getting a loan from a
              bank is not the right fit?
            </UseCaseExampleDescription>
          </UseCaseExampleBox>
          <UseCaseExampleBox>
            <UseCaseExampleTitle>Self-Owned Companies</UseCaseExampleTitle>
            <UseCaseExampleDescription>
              Raise your first round from your community and keep owning 100% of
              your shares.
            </UseCaseExampleDescription>
          </UseCaseExampleBox>
        </UseCasesExamples>
      </UseCaseContainer>
      <SuperpowerContainer>
        <SuperPowerImageContainer src={SuperPowerImage} />
        <FeatureBox>
          <SuperPowerTitle>
            Use your <HighlightText>superpower</HighlightText>: <br />
            Your Community
          </SuperPowerTitle>
          <SuperPowerDescription>
            You may not be eligible for a bank loan or you’d not find a classic
            investor for your business, but you have a community that believes
            in you.
            <br />
            <br />
            Crowdfund your first round from your community and share some of
            your future revenue with them with Revenue Sharing Agreements or
            Loan Agreements.
          </SuperPowerDescription>
        </FeatureBox>
      </SuperpowerContainer>
      <AutomateContainer>
        <AutomateImageContainer src={AutomateImage} />
        <FeatureBox>
          <AutomateTitle>
            Automate your fundraise <br />
            from <HighlightText>open</HighlightText> to{" "}
            <HighlightText>close</HighlightText>
          </AutomateTitle>
          <AutomateDescription>
            No more paperwork and wire transfers. <br />
            Send docs, collect digital signatures, receive funds & pay out
            dividends.
          </AutomateDescription>
        </FeatureBox>
      </AutomateContainer>
      <BottomSignupContainer>
        <BottomSignupTitle>Sign up for updates</BottomSignupTitle>
        <SubscribeBox />
      </BottomSignupContainer>
    </RootContainer>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  if (!email) return new Response("Email is required", { status: 400 });
  return axios
    .post<{ subscription: { subscriber: { id: string } } }>(
      `https://api.convertkit.com/v3/forms/3108950/subscribe`,
      {
        api_key: process.env.CONVERTKIT_API_KEY,
        email,
      }
    )
    .then(() => ({ success: true }));
};

export const meta = getMeta({ title: "Home" });

export const CatchBoundary = () => {
  const { data } = useCatch();
  return <div>{data}</div>;
};

export default Home;
