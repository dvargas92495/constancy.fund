import Layout, { getMeta } from "~/_common/Layout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import H1 from "@dvargas92495/ui/dist/components/H1";
import Body from "@dvargas92495/ui/dist/components/Body";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import type { Handler as GetHandler } from "../../functions/eversign/get";
import type { Handler as PostHandler } from "../../functions/agreement-sign/post";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import type { ExternalScriptsFunction } from "remix-utils";

import Icon from "~/_common/Icon";
import styled, { keyframes, css } from "styled-components";
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

import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import { LoadingIndicator } from "~/_common/LoadingIndicator";

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

const IconContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 5px;
`;

const EversignEmbedContainer = styled.div`
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  overflow: hidden;

  & > div {
    margin-bottom: 0px;
  }

  & iframe {
    border: none;
  }
`;

const LoadingBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

declare global {
  interface Window {
    eversign: {
      open: (params: {
        url: string;
        containerID: string;
        width?: number | string;
        height?: number | string;
        events?: {
          loaded?: () => void;
          signed?: () => void;
          declined?: () => void;
          error?: (a: unknown) => void;
        };
      }) => void;
    };
  }
}

const CONTAINER_ID = "eversign-embed";
const EversignEmbed = ({
  url,
  onSign,
}: {
  url: string;
  onSign: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (url) {
      setLoading(false);
      window.eversign.open({
        url,
        containerID: CONTAINER_ID,
        width: "100%",
        height: "100%",
        events: {
          signed: onSign,
          error: (a) => {
            console.log("error", a);
          },
        },
      });
    }
  }, [url, setLoading]);
  return (
    <Box id={CONTAINER_ID} sx={{ height: "60vh", marginBottom: "32px" }}>
      {loading && (
        <LoadingBox>
          <LoadingIndicator />{" "}
        </LoadingBox>
      )}
    </Box>
  );
};

const ContractPage = (): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [contracUuid, setContractUuid] = useState("");
  const [isInvestor, setIsInvestor] = useState(false);
  const [url, setUrl] = useState("");
  const [agreementUuid, setAgreementUuid] = useState("");
  const [type, setType] = useState("Agreement");
  const [error, setError] = useState("");
  const getEversign = useHandler<GetHandler>({
    path: "eversign",
    method: "GET",
  });
  const signAgreement = useHandler<PostHandler>({
    path: "agreement-sign",
    method: "POST",
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get("uuid");
    const signer = params.get("signer");
    if (uuid && signer) {
      getEversign({ uuid, signer })
        .then((r) => {
          setLoading(false);
          setAgreementUuid(r.agreementUuid);
          setUserId(r.userId);
          setType(r.type);
          setUrl(r.url);
          setIsInvestor(Number(signer) === 1);
          setContractUuid(r.contractUuid);
        })
        .catch((e) => setError(e.message));
    } else {
      setError("Contract and Signer ids are required");
    }
  }, [
    setAgreementUuid,
    setUserId,
    setType,
    setLoading,
    setError,
    setUrl,
    getEversign,
    setIsInvestor,
    setContractUuid,
  ]);

  return (
    <Layout>
      <ProfileContainer>
        <BackButton
          onClick={() =>
            window.location.assign(
              `/creator/${userId}?agreement=${agreementUuid}`
            )
          }
        >
          <Icon heightAndWidth={"20px"} name={"backArrow"} />
          Go Back
        </BackButton>
        <TopBarProfile>
          <TermSheetTitleBox>
            <ProfileTitle>Sign the agreement</ProfileTitle>
            {/* <PrimaryAction
            label={<IconContent><Icon heightAndWidth={'20px'} name={error ? 'repeat' : 'dollar'} color={'white'} />
              <span>{error ? error : 'Read and Sign Term Sheet'}</span>
            </IconContent>}
            onClick={onSign}
            height={'44px'}
            fontSize={'16px'}
            isLoading={loading}
            bgColor={error && 'warning'}
          /> */}
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
            <EversignEmbedContainer>
              <EversignEmbed
                url={url}
                onSign={() => {
                  signAgreement({ agreementUuid }).then(() => {
                    setSigned(true);
                    setSnackbarOpen(true);
                  });
                }}
              />
            </EversignEmbedContainer>
          </Section>
          {error}
          <Body>
            {signed && !isInvestor && (
              <Button
                color={"primary"}
                variant={"contained"}
                onClick={() =>
                  window.location.assign(
                    `/user/fundraises/contract/${contracUuid}`
                  )
                }
              >
                Back to Dashboard
              </Button>
            )}
          </Body>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpen(false)}
            color="success"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              {isInvestor
                ? "We are waiting for the creator to confirm this investment and send you an email with next steps when this happened."
                : "Congratulations! Both you and the investor have both signed the agreement! Now go create something awesome"}
            </Alert>
          </Snackbar>
        </ProfileBottomContainer>
      </ProfileContainer>
    </Layout>
  );
};

export const meta = getMeta({
  title: "Contract",
});

const scripts: ExternalScriptsFunction = () => {
  return [
    {
      src: "https://static.eversign.com/js/embedded-signing.js",
    },
  ];
};

export const handle = { scripts };

export default ContractPage;
