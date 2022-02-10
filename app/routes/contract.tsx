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
      {loading && <Skeleton variant={"rectangular"} sx={{ height: "100%" }} />}
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
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Button
          sx={{ color: "#888888" }}
          disabled={loading}
          onClick={() =>
            window.location.assign(
              `/creator/${userId}?agreement=${agreementUuid}`
            )
          }
        >
          Go Back
        </Button>
        {loading ? (
          <Skeleton variant={"rectangular"} />
        ) : (
          <>
            <H1 sx={{ fontSize: 24 }}>Sign the {type}</H1>
          </>
        )}
        <EversignEmbed
          url={url}
          onSign={() => {
            signAgreement({ agreementUuid }).then(() => {
              setSigned(true);
              setSnackbarOpen(true);
            });
          }}
        />
        <Body sx={{ color: "darkred" }} color={"error"}>
          {error}
          {signed && !isInvestor && (
            <Button
              color={"primary"}
              variant={"contained"}
              onClick={() =>
                window.location.assign(
                  `/user#/fundraises/contract/${contracUuid}`
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
      </Box>
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
