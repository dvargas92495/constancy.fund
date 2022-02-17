import React, { useCallback, useEffect, useState } from "react";
import Layout, { getMeta } from "~/_common/Layout";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import H1 from "@dvargas92495/ui/dist/components/H1";
import H4 from "@dvargas92495/ui/dist/components/H4";
import Avatar from "@mui/material/Avatar";
import Subtitle from "@dvargas92495/ui/dist/components/Subtitle";
import Body from "@dvargas92495/ui/dist/components/Body";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import Loading from "@dvargas92495/ui/dist/components/Loading";
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
import FUNDRAISE_TYPES from "../../../db/fundraise_types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import PaymentPreference from "~/_common/PaymentPreferences";
import type { Handler as GetHandler } from "../../../functions/agreement/get";
import type { Handler as PutHandler } from "../../../functions/agreement/put";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import type { Handler as GetPropsHandler } from "../../../functions/creator-profile/get";
import axios from "axios";


import Icon from "~/_common/Icon";
import styled, { keyframes, css } from 'styled-components'
import { PrimaryAction } from "~/_common/PrimaryAction";
import SectionCircle from "~/_common/SectionCircle";
import Spacer from "~/_common/Spacer";

import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import SectionTitle from "~/_common/SectionTitle";

const TopBarProfile = styled.div`
  border: 1px solid ${props => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 10;
`

const TopBarMoving = keyframes`0% { top: '-100px' } 100% { top: '100px'}`

const TopBarContainerMinified = styled.div<{ scroll?: number }>`
  display: ${(props) => props.scroll > 200 ? 'flex' : 'none'};
  position: ${(props) => props.scroll > 200 ? 'fixed' : 'none'};
  border: 1px solid ${props => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 150px;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 20;
  animation: 4s ease-in-out ${TopBarMoving} 1s; 
  align-items: center;
`



const TopBarMainBox = styled.div<{ scroll?: number }>`
  width: fill-available;
  display: flex;
  align-items: center;
  grid-gap: 40px;
  max-width: 800px;
  margin-top: 200px;
  padding: 0 50px;

  ${(props => props.scroll > 200 &&
    css`
        padding: 0 20px;
        margin-top: 0px;
        align-items: center;
        grid-gap: 20px;
      `
  )}
`

const ProfileImage = styled.div<{ scroll?: number }>`
  height: 200px;
  width: 200px;
  border: 1px solid ${props => props.theme.palette.color.backgroundDarkerDarker};
  border-radius: 300px;
  position: sticky;
  top: 200px;

  ${(props => props.scroll > 200 &&
    css`
        height: 100px;
        width: 100px;
      `
  )}
`

const ProfileContentBox = styled.div<{ scroll?: number }>`
  display: flex;
  flex-direction: column;
  grid-gap: 30px;
  width: fill-available;
  align-items: space-between;

  ${(props => props.scroll > 200 &&
    css`  
      grid-gap: 10px;
      `
  )}
`

const ProfileTitle = styled.div<{ scroll?: number }>`
    color: ${props => props.theme.palette.color.darkerText};
    font-size: 30px;
    font-weight: 800;
`

const ProfileLowerBar = styled.div<{ scroll?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ProfileSocialBar = styled.div<{ scroll?: number }>`
  display: flex;
  grid-gap: 20px;

`

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${props => props.theme.palette.color.backgroundColorDarker};
`

const ProfileBottomContainer = styled.div`
  width: 800px;
  padding-top: 150px;
  height: fit-content;
  padding-bottom: 100px;
`

const CreatorPublicContainer = styled.div`
  width: 100%;
`

const IconContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-gap: 5px;
`

const SectionInnerContent = styled.div`
`

const ConditionsContainer = styled.div`
  display: flex;
  grid-gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const SmallConditionsText = styled.span`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 12px;
  font-weight: 400;

`

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
`

const ConditionsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 5px;
`

const ConditionsTitle = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: bold;
  font-size: 16px;
`

const ConditionsSubTitle = styled.div`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-weight: normal;
  font-size: 12px;
`

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
`

const ContractExplainerTitle = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 18px;
  font-weight: 800;
`

const ContractExplainerInfo = styled.div`
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 14px;
  line-height: 21px;

`

const QuestionAireBox = styled.div`
  display: flex;
  grid-gap: 5px;
  flex-direction: column;
  margin-bottom: 50px;
`

const VideoEmbed = styled.iframe`
  width: fill-available;
  height: 400px;
  border: none;
  border-radius: 8px;
`


export function getScroll() {
  const [scrollPosition, setScrollPosition] = useState(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );

  useEffect(() => {
    const setScollPositionCallback = () => setScrollPosition(window.scrollY);

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', setScollPositionCallback);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', setScollPositionCallback);
      }
    };
  }, []);

  return scrollPosition;
};


export type Props = Awaited<ReturnType<GetPropsHandler>>;

const icons = [
  { test: /twitter\.com/, component: TwitterIcon, name: 'twitter' },
  { test: /github\.com/, component: GitHubIcon, name: 'github' },
  { test: /linkedin\.com/, component: LinkedInIcon, name: 'linkedIn' },
  { test: /instagram\.com/, component: InstagramIcon, name: 'Instagram' },
  { test: /facebook\.com/, component: FacebookIcon, name: 'facebook' },
  { test: /reddit\.com/, component: RedditIcon, name: 'reddit' },
  { test: /youtube\.com/, component: YouTubeIcon, name: 'youtube' },
  { test: /^mailto:/, component: EmailIcon, name: 'email' },
  { test: /.*/, component: WebIcon, name: 'webIcon' },
];

type Agreement = Awaited<ReturnType<GetHandler>>;

const CreatorProfile = ({
  fullName,
  profileImageUrl,
  email,
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
      <TopBarContainerMinified
        scroll={scrollPosition}
      >
        <TopBarMainBox
          scroll={scrollPosition}
        >
          <Avatar src={profileImageUrl} sx={{ width: 100, height: 100 }} />
          <ProfileContentBox
            scroll={scrollPosition}
          >
            <ProfileTitle
              scroll={scrollPosition}
            >
              {fullName} adsf
            </ProfileTitle>
            <ProfileLowerBar
              scroll={scrollPosition}
            >
              <ProfileSocialBar
                scroll={scrollPosition}
              >
                {socialProfiles.map((s, i) => {
                  const SocialIcon =
                    icons.find(({ test }) => test.test(s))
                  return (
                    <ExternalLink href={s} key={i}>
                      <Icon
                        heightAndWidth="16px"
                        color='purple'
                        name={SocialIcon.name}
                      />
                    </ExternalLink>
                  );
                })}
              </ProfileSocialBar>
              <PrimaryAction
                label={<IconContent><Icon heightAndWidth={'20px'} name={'dollar'} color={'white'} /> <span>Invest</span></IconContent>}
                onClick={() =>
                  setMode({
                    path: "details",
                    state: agreement || { contractUuid: f.uuid },
                  })
                }
                height={'44px'}
                fontSize={'16px'}
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
            <ProfileTitle>
              {fullName} adsf
            </ProfileTitle>
            <ProfileLowerBar>
              <ProfileSocialBar>
                {socialProfiles.map((s, i) => {
                  const SocialIcon =
                    icons.find(({ test }) => test.test(s))
                  return (
                    <ExternalLink href={s} key={i}>
                      <Icon
                        heightAndWidth="16px"
                        color='purple'
                        name={SocialIcon.name}
                      />
                    </ExternalLink>
                  );
                })}
              </ProfileSocialBar>
              <PrimaryAction
                label={<IconContent><Icon heightAndWidth={'20px'} name={'dollar'} color={'white'} /> <span>Invest</span></IconContent>}
                onClick={() =>
                  setMode({
                    path: "details",
                    state: agreement || { contractUuid: f.uuid },
                  })
                }
                height={'44px'}
                fontSize={'16px'}
              />
            </ProfileLowerBar>
          </ProfileContentBox>
        </TopBarMainBox>
      </TopBarProfile>
      <ProfileBottomContainer>
        <ConditionsContainer>
          <ConditionsBox>
            <SectionCircle width={'30px'} margin={'0'}>
              <Icon
                name={'dollar'}
                color={'purple'}
                heightAndWidth={'15px'}
              />
            </SectionCircle>
            <ConditionsContent>

              <ConditionsSubTitle>
                Wants to raise
              </ConditionsSubTitle>
              <ConditionsTitle>
                30.000
              </ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={'30px'} margin={'0'}>
              <Icon
                name={'repeat'}
                color={'purple'}
                heightAndWidth={'15px'}
              />
            </SectionCircle>
            <ConditionsContent>
              <ConditionsSubTitle>
                Pays Back
              </ConditionsSubTitle>
              <ConditionsTitle>
                60.000
              </ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={'30px'} margin={'0'}>
              <Icon
                name={'split'}
                color={'purple'}
                heightAndWidth={'15px'}
              />
            </SectionCircle>
            <ConditionsContent>

              <ConditionsSubTitle>
                Shares Revenue
              </ConditionsSubTitle>
              <ConditionsTitle>
                12%
              </ConditionsTitle>
            </ConditionsContent>
          </ConditionsBox>
          <ConditionsBox>
            <SectionCircle width={'30px'} margin={'0'}>
              <Icon
                name={'trendingUp'}
                color={'purple'}
                heightAndWidth={'15px'}
              />
            </SectionCircle>
            <ConditionsContent>

              <ConditionsSubTitle>
                Income Threshold
              </ConditionsSubTitle>
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
            The creator will start paying back a loan with interests once they reach their income threshold of $30.000 yearly. Then, 12% of their income is used to pay back investors.
          </ContractExplainerInfo>
        </ContractExplainerContainer>
        <Spacer height={'40px'} />
        <SectionTitle>
          About the Project
        </SectionTitle>
        <Spacer height={'20px'} />
        <Section>
          <VideoEmbed
            src="https://www.youtube.com/embed/PBNXY1Ud_Is" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
        </Section>
        <Section>
          <SectionInnerContent>
            {QUESTIONAIRES.map(({ q }, i) => (
              <QuestionAireBox>
                <ContractExplainerTitle
                >
                  {q}
                </ContractExplainerTitle>
                <ContractExplainerInfo>{questionaires[i]}</ContractExplainerInfo>
              </QuestionAireBox>
            ))}
          </SectionInnerContent>
        </Section>
      </ProfileBottomContainer>
    </ProfileContainer >
  );
};

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
  const [amount, setAmount] = useState(state.amount || 0);
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
      amount,
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
    <>
      <Button
        sx={{ color: "#888888" }}
        onClick={() => setMode({ path: "profile" })}
      >
        Go Back
      </Button>
      <H1 sx={{ fontSize: 24, marginTop: "24px" }}>Add your details</H1>
      <TextField
        sx={{ mb: 2 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        label={"Name"}
        required
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={"Email"}
        required
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        label={"Investment Amount"}
        type={"number"}
        required
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        label={"Company"}
        required
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        value={companyType}
        onChange={(e) => setCompanyType(e.target.value)}
        label={"Company Type"}
        required
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        label={"Address"}
        required
        fullWidth
      />
      <PaymentPreference
        value={paymentPreference}
        setValue={setPaymentPreference}
      />
      <Box display={"flex"} alignItems={"start"}>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={onSign}
          disabled={loading}
          sx={{ marginRight: "32px", flexShrink: 0 }}
        >
          Continue to Signing Term Sheets
        </Button>
        <Loading loading={loading} size={20} />
        <Body sx={{ color: "darkred" }} color={"error"}>
          {error}
        </Body>
      </Box>
    </>
  );
};

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
    <CreatorPublicContainer
    >
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
