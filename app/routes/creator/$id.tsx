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
  return (
    <>
      <H1 sx={{ fontSize: 24 }}>You've been invited to invest in {fullName}</H1>
      <Box display={"flex"} sx={{ marginBottom: "24px" }}>
        <Avatar src={profileImageUrl} sx={{ width: 76, height: 76 }} />
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
        <Box key={i} sx={{ mb: "48px" }}>
          <Subtitle
            sx={{ fontSize: 12, lineHeight: "20px", my: 0, color: "#888888" }}
          >
            {q}
          </Subtitle>
          <Body sx={{ my: "4px" }}>{questionaires[i]}</Body>
        </Box>
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
    </>
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
    <Box
      sx={{
        maxWidth: "800px",
        width: "100%",
      }}
    >
      {mode.path === "profile" && (
        <CreatorProfile {...props} setMode={setMode} />
      )}
      {mode.path === "details" && (
        <EnterDetails {...mode.state} setMode={setMode} />
      )}
      {mode.path === "pending" && <Pending />}
    </Box>
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
