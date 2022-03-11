import React, { useEffect, useState } from "react";
import getMeta from "~/_common/getMeta";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import QUESTIONAIRES from "~/_common/questionaires";
import {
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from "remix";

import Icon from "~/_common/Icon";
import styled, { keyframes, css } from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import SectionCircle from "~/_common/SectionCircle";
import Spacer from "~/_common/Spacer";

import Section from "~/_common/Section";
import SectionTitle from "~/_common/SectionTitle";
import { IconContent, ProfileTitle, TopBarProfile } from "../$id";
import CompanyLogo from "~/_common/Images/memexlogo.png";
import formatAmount from "../../../../db/util/formatAmount";
import getPublicUserProfile from "~/data/getPublicUserProfile.server";
import { Id as PaymentPreferenceId } from "~/enums/paymentPreferences";

type Props = Awaited<ReturnType<typeof getPublicUserProfile>>;

function useScroll() {
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

const icons = [
  { test: /twitter\.com/, name: "twitter" },
  { test: /github\.com/, name: "github" },
  { test: /linkedin\.com/, name: "linkedIn" },
  { test: /instagram\.com/, name: "Instagram" },
  { test: /facebook\.com/, name: "facebook" },
  { test: /reddit\.com/, name: "reddit" },
  { test: /youtube\.com/, name: "youtube" },
  { test: /^mailto:/, name: "email" },
  { test: /.*/, name: "webIcon" },
] as const;

const TopBarMoving = keyframes`0% { top: '-100px' } 100% { top: '100px'}`;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

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

const SectionSubTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.palette.color.lighterText};
  font-size: 14px;
  grid-gap: 20px;
  margin-top: 20px;
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

const ProfilePaymentPreferenceBar = styled.div<{ scroll?: number }>`
  display: flex;
  grid-gap: 20px;
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

const ConditionsContainer = styled.div`
  display: flex;
  grid-gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ConditionsBox = styled.div`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  height: 80px;
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

const SmallConditionsText = styled.span`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 12px;
  font-weight: 400;
`;

const ConditionsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 0px;
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

const RaisesWith = styled.span`
  color: ${(props) => props.theme.palette.text.tertiary};
  margin-right: 10px;
  font-weight: 500;
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
  margin-bottom: 10px;
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

const ProfileImageContainer = styled.div<{ scroll?: number }>`
  width: ${({ scroll = 0 }) => (scroll > 200 ? "100px" : "150px")};
  height: ${({ scroll = 0 }) => (scroll > 200 ? "100px" : "150px")};
  position: relative;

  & * {
    width: fill-available;
    height: fill-available;
  }
`;

const SectionInnerContent = styled.div``;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
`;

const paymentIconsById: Record<
  PaymentPreferenceId,
  string | number | React.ReactElement
> = {
  paypal: <Icon heightAndWidth={"24px"} color="purple" name={"paypalSmall"} />,
  bank: <Icon name={"bank"} color="purple" width={"100px"} />,
  ethereum: <Icon heightAndWidth={"24px"} color="purple" name={"ethereum"} />,
  bitcoin: <Icon heightAndWidth={"24px"} color="purple" name={"bitcoin"} />,
  near: <Icon heightAndWidth={"24px"} color="purple" name={"near"} />,
};

const CreatorProfile = (): React.ReactElement => {
  const props = useLoaderData<Props>();
  const navigate = useNavigate();
  const {
    userId,
    // fullName,
    companyName,
    demoVideo,
    socialProfiles = [],
    questionaires = [],
    fundraises = [],
    paymentPreferences = [],
  } = props;
  const agreementUuid = useParams()["agreement"];

  const scrollPosition = useScroll();

  return (
    <ProfileContainer>
      <TopBarContainerMinified scroll={scrollPosition}>
        <TopBarMainBox scroll={scrollPosition}>
          <ProfileImageContainer scroll={scrollPosition}>
            <ProfileImage>
              <img
                src={CompanyLogo}
                alt={"Profile Image"}
                style={{ borderRadius: "150px" }}
              />
            </ProfileImage>
          </ProfileImageContainer>
          <ProfileContentBox scroll={scrollPosition}>
            <ProfileTitle scroll={scrollPosition}>{companyName}</ProfileTitle>
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
                    <span>Back this Project</span>
                  </IconContent>
                }
                onClick={() => {
                  navigate(
                    `/creator/${userId}/invest${
                      agreementUuid
                        ? `?agreement=${agreementUuid}`
                        : `?fundraise=${fundraises[0].uuid}`
                    }`
                  );
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
          <ProfileImageContainer scroll={scrollPosition}>
            <ProfileImage>
              <img
                src={CompanyLogo}
                alt={"Profile Image"}
                style={{ borderRadius: "150px" }}
              />
            </ProfileImage>
          </ProfileImageContainer>
          <ProfileContentBox>
            <ProfileTitle>{companyName}</ProfileTitle>
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
                    <span>Back this Project</span>
                  </IconContent>
                }
                onClick={() => {
                  navigate(
                    `/creator/${userId}/invest${
                      agreementUuid
                        ? `?agreement=${agreementUuid}`
                        : `?fundraise=${fundraises[0].uuid}`
                    }`
                  );
                }}
                height={"44px"}
                fontSize={"16px"}
              />
            </ProfileLowerBar>
          </ProfileContentBox>
        </TopBarMainBox>
      </TopBarProfile>
      {fundraises[0] && (
        <ProfileBottomContainer paddingTop={"110px"}>
          <ContractExplainerContainer>
            <ContractExplainerTitle>
              <RaisesWith>Raises with:</RaisesWith> Revenue Sharing Agreement
            </ContractExplainerTitle>
            <ContractExplainerInfo>
              The creator will start paying back a loan with interests once they
              reach their revenue threshold of $
              {formatAmount(Number(fundraises[0].details.threshold || 0))}{" "}
              yearly. Then,{" "}
              {formatAmount(Number(fundraises[0].details.share || 0))}% of their
              income is used to pay back investors.{" "}
              {formatAmount(Number(fundraises[0].details.cap)) && (
                <>
                  The agreement runs out after{" "}
                  {formatAmount(Number(fundraises[0].details.cap))} years.
                </>
              )}
            </ContractExplainerInfo>
            <SectionSubTitle>
              Accepts Payments in:{" "}
              <ProfilePaymentPreferenceBar scroll={scrollPosition}>
                {paymentPreferences.map((s, i) => (
                  <React.Fragment key={i}>{paymentIconsById[s]}</React.Fragment>
                ))}
              </ProfilePaymentPreferenceBar>
            </SectionSubTitle>
          </ContractExplainerContainer>
          <ConditionsContainer>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon
                  name={"dollar"}
                  color={"purple"}
                  heightAndWidth={"15px"}
                />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Wants to raise</ConditionsSubTitle>
                <ConditionsTitle>
                  {formatAmount(fundraises[0].details.amount)}{" "}
                  {Number(fundraises[0].details.frequency) > 1 && (
                    <SmallConditionsText> / month</SmallConditionsText>
                  )}
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon
                  name={"repeat"}
                  color={"purple"}
                  heightAndWidth={"15px"}
                />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Pays Back</ConditionsSubTitle>
                <ConditionsTitle>
                  {formatAmount(
                    (Number(fundraises[0].details.return || 0) *
                      Number(fundraises[0].details.frequency || 1) *
                      Number(fundraises[0].details.amount || 0)) /
                      100
                  )}
                  <SmallConditionsText>
                    {" "}
                    {formatAmount(Number(fundraises[0].details.return || 0))}%
                  </SmallConditionsText>
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon name={"split"} color={"purple"} heightAndWidth={"15px"} />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Shares Revenue</ConditionsSubTitle>
                <ConditionsTitle>
                  {formatAmount(Number(fundraises[0].details.share || 0))}%
                </ConditionsTitle>
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
                  ${formatAmount(Number(fundraises[0].details.threshold || 0))}
                  <SmallConditionsText>/year</SmallConditionsText>
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
          </ConditionsContainer>
          <Spacer height={"40px"} />
          <SectionTitle>About the Project</SectionTitle>
          <Spacer height={"20px"} />
          <Section>
            <VideoEmbed
              src={demoVideo || "https://www.youtube.com/embed/PBNXY1Ud_Is"}
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Section>
          <Section>
            <SectionInnerContent>
              {QUESTIONAIRES.map(({ q }, i) => (
                <QuestionAireBox key={i}>
                  <ContractExplainerTitle>{q}</ContractExplainerTitle>
                  <ContractExplainerInfo>
                    {questionaires[i]}
                  </ContractExplainerInfo>
                </QuestionAireBox>
              ))}
            </SectionInnerContent>
          </Section>
        </ProfileBottomContainer>
      )}
    </ProfileContainer>
  );
};

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
  return getPublicUserProfile(params.id || "");
};

export const meta: MetaFunction = (args) =>
  getMeta({
    title: args.data.fullName,
  })(args);

export default CreatorProfile;
