import React, { useCallback, useEffect, useState } from "react";
import Layout, { getMeta } from "~/_common/Layout";
import Box from "@mui/material/Box";
import H1 from "@dvargas92495/ui/dist/components/H1";
import Avatar from "@mui/material/Avatar";
import Body from "@dvargas92495/ui/dist/components/Body";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import WebIcon from "@mui/icons-material/Public";
import QUESTIONAIRES from "~/_common/questionaires";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import PaymentPreference from "~/_common/PaymentPreferences";
import type { Handler as GetHandler } from "../../../functions/agreement/get";
import type { Handler as PutHandler } from "../../../functions/agreement/put";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import type { Handler as GetPropsHandler } from "../../../functions/creator-profile/get";
import axios from "axios";
import CheckBox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CountryRegionData from "country-region-data";

import Icon from "~/_common/Icon";
import styled, { keyframes, css } from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import SectionCircle from "~/_common/SectionCircle";
import Spacer from "~/_common/Spacer";

import Section from "~/_common/Section";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import SectionTitle from "~/_common/SectionTitle";

import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";

const TopBarProfile = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 10;
`;

const TopBarMoving = keyframes`0% { top: '-100px' } 100% { top: '100px'}`;

const TopBarContainerMinified = styled.div<{ scroll?: number }>`
  display: ${(props) => (props.scroll && props.scroll > 200 ? "flex" : "none")};
  position: ${(props) =>
    props.scroll && props.scroll > 200 ? "fixed" : "none"};
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 150px;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 20;
  animation: 4s ease-in-out ${TopBarMoving} 1s;
  align-items: center;
`;

const TopBarMainBox = styled.div<{ scroll?: number }>`
  width: fill-available;
  display: flex;
  align-items: center;
  grid-gap: 40px;
  max-width: 800px;
  margin-top: 200px;
  padding: 0 50px;

  ${(props) =>
    props.scroll &&
    props.scroll > 200 &&
    css`
      padding: 0 20px;
      margin-top: 0px;
      align-items: center;
      grid-gap: 20px;
    `}
`;

const ProfileImage = styled.div<{ scroll?: number }>`
  height: 200px;
  width: 200px;
  border: 1px solid
    ${(props) => props.theme.palette.color.backgroundColorDarkerDarker};
  border-radius: 300px;
  position: sticky;
  top: 200px;

  ${(props) =>
    props.scroll &&
    props.scroll > 200 &&
    css`
      height: 100px;
      width: 100px;
    `}
`;

const ProfileContentBox = styled.div<{ scroll?: number }>`
  display: flex;
  flex-direction: column;
  grid-gap: 30px;
  width: fill-available;
  align-items: space-between;

  ${(props) =>
    props.scroll &&
    props.scroll > 200 &&
    css`
      grid-gap: 5px;
    `}
`;

const ProfileTitle = styled.div<{ scroll?: number }>`
  color: ${(props) => props.theme.palette.color.darkerText};
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ProfileLowerBar = styled.div<{ scroll?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileSocialBar = styled.div<{ scroll?: number }>`
  display: flex;
  grid-gap: 20px;
`;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
`;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

const CreatorPublicContainer = styled.div`
  width: 100%;
`;

const IconContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 5px;
`;

const SectionInnerContent = styled.div``;

const ConditionsContainer = styled.div`
  display: flex;
  grid-gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SmallConditionsText = styled.span`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 12px;
  font-weight: 400;
`;

const ConditionsBox = styled.div`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  height: 50px;
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  grid-gap: 10px;
  display: flex;
`;

const ConditionsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 5px;
`;

const ConditionsTitle = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: bold;
  font-size: 16px;
`;

const ConditionsSubTitle = styled.div`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-weight: normal;
  font-size: 12px;
`;

const ContractExplainerContainer = styled.div`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: white;
  border-radius: 8px;
  margin-bottom: 30px;
  grid-gap: 10px;
`;

const ContractExplainerTitle = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 18px;
  font-weight: 800;
`;

const ContractExplainerInfo = styled.div`
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 14px;
  line-height: 21px;
`;

const QuestionAireBox = styled.div`
  display: flex;
  grid-gap: 5px;
  flex-direction: column;
  margin-bottom: 50px;
`;

const VideoEmbed = styled.iframe`
  width: fill-available;
  height: 400px;
  border: none;
  border-radius: 8px;
`;

export function getScroll() {
  const [scrollPosition, setScrollPosition] = useState(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  useEffect(() => {
    const setScollPositionCallback = () => setScrollPosition(window.scrollY);

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", setScollPositionCallback);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", setScollPositionCallback);
      }
    };
  }, []);

  return scrollPosition;
}

export type Props = Awaited<ReturnType<GetPropsHandler>>;

const icons = [
  { test: /twitter\.com/, component: TwitterIcon, name: "twitter" },
  { test: /github\.com/, component: GitHubIcon, name: "github" },
  { test: /linkedin\.com/, component: LinkedInIcon, name: "linkedIn" },
  { test: /instagram\.com/, component: InstagramIcon, name: "Instagram" },
  { test: /facebook\.com/, component: FacebookIcon, name: "facebook" },
  { test: /reddit\.com/, component: RedditIcon, name: "reddit" },
  { test: /youtube\.com/, component: YouTubeIcon, name: "youtube" },
  { test: /^mailto:/, component: EmailIcon, name: "email" },
  { test: /.*/, component: WebIcon, name: "webIcon" },
] as const;

type Agreement = Awaited<ReturnType<GetHandler>>;

const CreatorProfile = ({
  fullName,
  profileImageUrl,
  socialProfiles = [],
  questionaires = [],
  fundraises = [],
  setMode,
}: Props & {
  setMode: (m: {
    path: string;
    state?: Agreement | { contractUuid: string };
  }) => void;
}): React.ReactElement => {
  const [agreement, setAgreement] = useState<Agreement>();
  const getAgreement = useHandler<GetHandler>({
    path: "agreement",
    method: "GET",
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agreementUuid = params.get("agreement");
    if (agreementUuid) {
      getAgreement({ uuid: agreementUuid }).then((r) => {
        setAgreement(r);
      });
    }
  }, [setAgreement, getAgreement]);

  const scrollPosition = getScroll();

  return (
    <ProfileContainer>
      <TopBarContainerMinified scroll={scrollPosition}>
        <TopBarMainBox scroll={scrollPosition}>
          <Avatar src={profileImageUrl} sx={{ width: 100, height: 100 }} />
          <ProfileContentBox scroll={scrollPosition}>
            <ProfileTitle scroll={scrollPosition}>{fullName}</ProfileTitle>
            <ProfileLowerBar scroll={scrollPosition}>
              <ProfileSocialBar scroll={scrollPosition}>
                {socialProfiles.map((s, i) => {
                  const SocialIcon = icons.find(({ test }) => test.test(s));
                  return (
                    <ExternalLink href={s} key={i}>
                      <Icon
                        heightAndWidth="16px"
                        color="purple"
                        name={SocialIcon?.name || "webIcon"}
                      />
                    </ExternalLink>
                  );
                })}
              </ProfileSocialBar>
              <PrimaryAction
                label={
                  <IconContent>
                    <Icon
                      heightAndWidth={"20px"}
                      name={"dollar"}
                      color={"white"}
                    />{" "}
                    <span>Invest</span>
                  </IconContent>
                }
                onClick={() => {
                  setMode({
                    path: "details",
                    state: agreement || { contractUuid: fundraises[0].uuid },
                  });
                }}
                height={"44px"}
                fontSize={"16px"}
              />
            </ProfileLowerBar>
          </ProfileContentBox>
        </TopBarMainBox>
      </TopBarContainerMinified>

      <TopBarProfile>
        <TopBarMainBox>
          <ProfileImage>
            <Avatar src={profileImageUrl} sx={{ width: 200, height: 200 }} />
          </ProfileImage>
          <ProfileContentBox>
            <ProfileTitle>{fullName}</ProfileTitle>
            <ProfileLowerBar>
              <ProfileSocialBar>
                {socialProfiles.map((s, i) => {
                  const SocialIcon = icons.find(({ test }) => test.test(s));
                  return (
                    <ExternalLink href={s} key={i}>
                      <Icon
                        heightAndWidth="16px"
                        color="purple"
                        name={SocialIcon?.name || "webIcon"}
                      />
                    </ExternalLink>
                  );
                })}
              </ProfileSocialBar>
              <PrimaryAction
                label={
                  <IconContent>
                    <Icon
                      heightAndWidth={"20px"}
                      name={"dollar"}
                      color={"white"}
                    />{" "}
                    <span>Invest</span>
                  </IconContent>
                }
                onClick={() =>
                  setMode({
                    path: "details",
                    state: agreement || { contractUuid: fundraises[0].uuid },
                  })
                }
                height={"44px"}
                fontSize={"16px"}
              />
            </ProfileLowerBar>
          </ProfileContentBox>
        </TopBarMainBox>
      </TopBarProfile>
      <ProfileBottomContainer paddingTop={"150px"}>
        <ConditionsContainer>
          <ConditionsBox>
            <SectionCircle width={"30px"} margin={"0"}>
              <Icon name={"dollar"} color={"purple"} heightAndWidth={"15px"} />
            </SectionCircle>
            <ConditionsContent>
              <ConditionsSubTitle>Wants to raise</ConditionsSubTitle>
              <ConditionsTitle>30.000</ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={"30px"} margin={"0"}>
              <Icon name={"repeat"} color={"purple"} heightAndWidth={"15px"} />
            </SectionCircle>
            <ConditionsContent>
              <ConditionsSubTitle>Pays Back</ConditionsSubTitle>
              <ConditionsTitle>60.000</ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={"30px"} margin={"0"}>
              <Icon name={"split"} color={"purple"} heightAndWidth={"15px"} />
            </SectionCircle>
            <ConditionsContent>
              <ConditionsSubTitle>Shares Revenue</ConditionsSubTitle>
              <ConditionsTitle>12%</ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={"30px"} margin={"0"}>
              <Icon
                name={"trendingUp"}
                color={"purple"}
                heightAndWidth={"15px"}
              />
            </SectionCircle>
            <ConditionsContent>
              <ConditionsSubTitle>Income Threshold</ConditionsSubTitle>
              <ConditionsTitle>
                30.000<SmallConditionsText>/year</SmallConditionsText>
              </ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
        </ConditionsContainer>
        <ContractExplainerContainer>
          <ContractExplainerTitle>
            Income Sharing Agreement
          </ContractExplainerTitle>
          <ContractExplainerInfo>
            The creator will start paying back a loan with interests once they
            reach their income threshold of $30.000 yearly. Then, 12% of their
            income is used to pay back investors.
          </ContractExplainerInfo>
        </ContractExplainerContainer>
        <Spacer height={"40px"} />
        <SectionTitle>About the Project</SectionTitle>
        <Spacer height={"20px"} />
        <Section>
          <VideoEmbed
            src="https://www.youtube.com/embed/PBNXY1Ud_Is"
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Section>
        <Section>
          <SectionInnerContent>
            {QUESTIONAIRES.map(({ q }, i) => (
              <QuestionAireBox>
                <ContractExplainerTitle>{q}</ContractExplainerTitle>
                <ContractExplainerInfo>
                  {questionaires[i]}
                </ContractExplainerInfo>
              </QuestionAireBox>
            ))}
          </SectionInnerContent>
        </Section>
      </ProfileBottomContainer>
    </ProfileContainer>
  );
};

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

const EnterDetails = ({
  setMode,
  ...state
}: {
  setMode: (m: {
    path: string;
    state?: Agreement | { contractUuid: string };
  }) => void;
} & Partial<Agreement>) => {
  const [name, setName] = useState(state.name || "");
  const [email, setEmail] = useState(state.email || "");
  const [amount, setAmount] = useState(state.amount || '');
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
    setMode,
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
    <ProfileContainer>
      <BackButton onClick={() => setMode({ path: "profile" })}>
        <Icon heightAndWidth={"20px"} name={"mail"} />
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
          {/* <ProfileLowerBar>
              <PrimaryAction
                label={<IconContent><Icon heightAndWidth={'20px'} name={'dollar'} color={'white'} /> <span>Invest</span></IconContent>}
                onClick={() => null
                }
                height={'44px'}
                fontSize={'16px'}
              />
            </ProfileLowerBar> */}
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
    </ProfileContainer>
  );
};

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

const Pending = () => {
  return (
    <Box textAlign={"center"}>
      <H1 sx={{ fontSize: 24 }}>Hey check your email</H1>
      <Body>
        You will be sent a secure link to sign the generated contract.
      </Body>
    </Box>
  );
};

const CreatorLayout = (props: Props): React.ReactElement => {
  const [mode, setMode] = useState<{
    path: string;
    state?: Agreement | { contractUuid: string };
  }>({
    path: "profile",
    state: undefined,
  });
  return (
    <CreatorPublicContainer>
      {mode.path === "profile" && (
        <CreatorProfile {...props} setMode={setMode} />
      )}
      {mode.path === "details" && (
        <EnterDetails {...mode.state} setMode={setMode} />
      )}
      {mode.path === "pending" && <Pending />}
    </CreatorPublicContainer>
  );
};

const CreatorPage = (): React.ReactElement => {
  const props = useLoaderData<Props>();
  return (
    <Layout>
      <CreatorLayout {...props} />
    </Layout>
  );
};

export const loader: LoaderFunction = ({ params }) => {
  return axios
    .get<Props>(`${process.env.API_URL}/creator-profile?id=${params["id"]}`)
    .then((r) => r.data);
};

export const meta: MetaFunction = (args) =>
  getMeta({
    title: args.data.fullName,
  })(args);

export default CreatorPage;
