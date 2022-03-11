import getMeta from "~/_common/getMeta";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Body from "@dvargas92495/ui/dist/components/Body";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import signAgreement from "~/data/signAgreement.server";
import type { ExternalScriptsFunction } from "remix-utils";

import Icon from "~/_common/Icon";
import styled from "styled-components";
import Section from "~/_common/Section";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
import {
  ActionFunction,
  LoaderFunction,
  useActionData,
  useFetcher,
  useLoaderData,
  useParams,
} from "remix";
import getContract from "../data/getContract.server";

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

type Data = Awaited<ReturnType<typeof getContract>>;

const ContractPage = (): React.ReactElement => {
  const { contractUuid, userId, url, agreementUuid } = useLoaderData<Data>();
  const isInvestor = Number(useParams().signer) === 1;
  const [signed, setSigned] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fetcher = useFetcher();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.success) {
      setSigned(true);
      setSnackbarOpen(true);
    }
  }, [actionData?.success]);
  return (
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
        </TermSheetTitleBox>
      </TopBarProfile>
      <ProfileBottomContainer paddingTop={"20px"}>
        <Section>
          <EversignEmbedContainer>
            <EversignEmbed
              url={url}
              onSign={() => {
                fetcher.submit({ agreementUuid }, { method: "post" });
              }}
            />
          </EversignEmbedContainer>
        </Section>
        <Body>
          {signed && !isInvestor && (
            <Button
              color={"primary"}
              variant={"contained"}
              onClick={() =>
                window.location.assign(
                  `/user/fundraises/contract/${contractUuid}`
                )
              }
            >
              Back to Dashboard
            </Button>
          )}
        </Body>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
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
  );
};

export const loader: LoaderFunction = ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  return getContract({
    uuid: searchParams.get("uuid") || "",
    signer: searchParams.get("signer") || "",
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const agreementUuid = formData.get("agreementUuid");
  if (!agreementUuid)
    return new Response("`agreementUuid` is required", { status: 400 });
  if (typeof agreementUuid !== "string")
    return new Response("`agreementUuid` must be a string", { status: 400 });
  return signAgreement({ agreementUuid });
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
