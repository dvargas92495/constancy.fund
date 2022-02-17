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
import styled from 'styled-components'
import { PrimaryAction } from "~/_common/PrimaryAction";

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

const TopBarContainerMinified = styled.div<{ scroll: number }>`
  display: ${(props) => props.scroll > 200 ? 'flex' : 'none'};
  position: ${(props) => props.scroll > 200 ? 'fixed' : 'none'};
  border: 1px solid ${props => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 20;
`

const TopBarMainBox = styled.div`
  width: fill-available;
  display: flex;
  align-items: center;
  grid-gap: 40px;
  padding: 0 40px;
  margin: auto;
  max-width: 800px;
  margin-top: 100px;
  padding: 0 50px;
`

const ProfileImage = styled.div`
  height: 200px;
  width: 200px;
  border: 1px solid ${props => props.theme.palette.color.backgroundDarkerDarker};
  border-radius: 300px;
  position: sticky;
  top: 200px;
`

const ProfileContentBox = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 30px;
  width: fill-available;
  align-items: space-between;
`

const ProfileTitle = styled.div`
    color: ${props => props.theme.palette.color.darkerText};
    font-size: 30px;
    font-weight: 800;
`

const ProfileLowerBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ProfileSocialBar = styled.div`

`

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${props => props.theme.palette.color.backgroundHighlight};
`

const ProfileBottomContainer = styled.div`
  width: 800px;
  padding-top: 150px;
  height: fit-content;
  padding-bottom: 500px;
  height: 4000px;
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
    position: sticky;
    top: 350px;
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
  { test: /twitter\.com/, component: TwitterIcon },
  { test: /github\.com/, component: GitHubIcon },
  { test: /linkedin\.com/, component: LinkedInIcon },
  { test: /instagram\.com/, component: InstagramIcon },
  { test: /facebook\.com/, component: FacebookIcon },
  { test: /reddit\.com/, component: RedditIcon },
  { test: /youtube\.com/, component: YouTubeIcon },
  { test: /^mailto:/, component: EmailIcon },
  { test: /.*/, component: WebIcon },
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

  console.log(scrollPosition)

  return (
    <ProfileContainer>
      <TopBarContainerMinified
        scroll={scrollPosition}
      >
        <TopBarMainBox>
          <ProfileContentBox>
            <ProfileTitle>
              {fullName} adsf
            </ProfileTitle>
            <ProfileLowerBar>
              <ProfileSocialBar>
                <Box>
                  {socialProfiles.map((s, i) => {
                    const SocialIcon =
                      icons.find(({ test }) => test.test(s))?.component || WebIcon;
                    return (
                      <ExternalLink href={s} key={i}>
                        <SocialIcon
                          sx={{ opacity: 0.5, marginRight: "16px" }}
                          fontSize={"small"}
                        />
                      </ExternalLink>
                    );
                  })}
                </Box>
              </ProfileSocialBar>
              <PrimaryAction
                label={<IconContent><Icon heightAndWidth={'20px'} name={'dollar'} color={'white'} /> <span>Support</span></IconContent>}
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
                <Box>
                  {socialProfiles.map((s, i) => {
                    const SocialIcon =
                      icons.find(({ test }) => test.test(s))?.component || WebIcon;
                    return (
                      <ExternalLink href={s} key={i}>
                        <SocialIcon
                          sx={{ opacity: 0.5, marginRight: "16px" }}
                          fontSize={"small"}
                        />
                      </ExternalLink>
                    );
                  })}
                </Box>
              </ProfileSocialBar>
              <PrimaryAction
                label={<IconContent><Icon heightAndWidth={'20px'} name={'dollar'} color={'white'} /> <span>Support</span></IconContent>}
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
        <Section>
          <SectionInnerContent>
            <H1 sx={{ fontSize: 24 }}>You've been invited to invest in {fullName}</H1>
            <Box display={"flex"} sx={{ marginBottom: "24px" }}>
              <Box sx={{ paddingLeft: "16px", paddingTop: "4px" }}>
                <H4 sx={{ fontSize: 14, lineHeight: "20px", my: 0 }}>{fullName}</H4>
                <Subtitle sx={{ fontSize: 12, lineHeight: "20px", my: 0 }}>
                  {email}
                </Subtitle>
                <Box>
                  {socialProfiles.map((s, i) => {
                    const SocialIcon =
                      icons.find(({ test }) => test.test(s))?.component || WebIcon;
                    return (
                      <ExternalLink href={s} key={i}>
                        <SocialIcon
                          sx={{ opacity: 0.5, marginRight: "16px" }}
                          fontSize={"small"}
                        />
                      </ExternalLink>
                    );
                  })}
                </Box>
              </Box>
            </Box>
            {QUESTIONAIRES.map(({ q }, i) => (
              <Section>
                <Box key={i} sx={{ mb: "48px" }}>
                  <Subtitle
                    sx={{ fontSize: 12, lineHeight: "20px", my: 0, color: "#888888" }}
                  >
                    {q}
                  </Subtitle>
                  <Body sx={{ my: "4px" }}>{questionaires[i]}</Body>
                </Box>
              </Section>
            ))}
            <Subtitle
              sx={{
                fontSize: 12,
                lineHeight: "20px",
                my: 0,
                color: "#888888",
                marginBottom: "8px",
              }}
            >
              Fundraises
            </Subtitle>
            {fundraises
              .filter((f) => !agreement || agreement.contractUuid === f.uuid)
              .map((f) => (
                <Card key={f.uuid} sx={{ padding: "32px", marginBottom: "32px" }}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Box>
                      <H1 sx={{ fontSize: 24, my: 0 }}>
                        {FUNDRAISE_TYPES[f.type].name}
                      </H1>
                      <Subtitle
                        sx={{
                          fontSize: 12,
                          lineHeight: "20px",
                          my: 0,
                          color: "#888888",
                        }}
                      >
                        {FUNDRAISE_TYPES[f.type].description}
                      </Subtitle>
                    </Box>
                    <Box>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() =>
                          setMode({
                            path: "details",
                            state: agreement || { contractUuid: f.uuid },
                          })
                        }
                        sx={{ marginLeft: "16px" }}
                      >
                        Invest
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
          </SectionInnerContent>
        </Section>
      </ProfileBottomContainer>
    </ProfileContainer>
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
