import React from "react";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
import Box from "@mui/material/Box";
import H1 from "@dvargas92495/ui/dist/components/H1";
import H4 from "@dvargas92495/ui/dist/components/H4";
import Avatar from "@mui/material/Avatar";
import Subtitle from "@dvargas92495/ui/dist/components/Subtitle";
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
import QUESTIONAIRES from "../_common/questionaires";

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

export const CreatorComponent = ({
  fullName,
  profileImageUrl,
  email,
  socialProfiles,
  questionaires,
}: Props): React.ReactElement => {
  return (
    <Box
      sx={{
        maxWidth: "800px",
        width: "100%",
      }}
    >
      <H1 sx={{ fontSize: 24 }}>
        You've been invited to {fullName}'s fundraise
      </H1>
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
        sx={{ fontSize: 12, lineHeight: "20px", my: 0, color: "#888888" }}
      >
        Terms
      </Subtitle>
    </Box>
  );
};

const CreatorPage = (props: Props): React.ReactElement => (
  <Layout>
    <CreatorComponent {...props} />
  </Layout>
);

export const Head = ({ fullName }: { fullName: string }) => (
  <LayoutHead title={fullName} />
);

export default CreatorPage;
