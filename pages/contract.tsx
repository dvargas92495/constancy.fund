import Layout, { LayoutHead } from "./_common/Layout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import H1 from "@dvargas92495/ui/dist/components/H1";
import Body from "@dvargas92495/ui/dist/components/Body";
import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useState } from "react";
import type { Handler as GetHandler } from "../functions/eversign/get";
import type { Handler as PostHandler } from "../functions/agreement-sign/post";
import useHandler from "@dvargas92495/ui/dist/useHandler";

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
  const [finished, setFinished] = useState(false);
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [agreementUuid, setAgreementUuid] = useState("");
  const [type, setType] = useState("Agreement");
  const [error, setError] = useState("");
  const [isInvestor, setIsInvestor] = useState(false);
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
          setIsInvestor(r.isInvestor);
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
    setIsInvestor
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
            finished
              ? setFinished(false)
              : window.location.assign(
                  `/creator/${userId}?agreement=${agreementUuid}`
                )
          }
        >
          Go Back
        </Button>
        {!finished ? (
          <>
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
                signAgreement({ agreementUuid, isInvestor }).then(() => setSigned(true));
              }}
            />
            <Box display={"flex"}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => setFinished(true)}
                disabled={!signed}
                sx={{ marginRight: "32px" }}
              >
                Finish
              </Button>
              <Body sx={{ color: "darkred" }} color={"error"}>
                {error}
              </Body>
            </Box>
          </>
        ) : (
          <Box textAlign={"center"}>
            <H1 sx={{ fontSize: 24 }}>
              Waiting for the creator to confirm the investment.
            </H1>
            <Body>
              We are waiting for the creator to confirm this investment and send
              you an email with next steps when this happened.
            </Body>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export const Head = ({ fullName }: { fullName: string }) => (
  <>
    <LayoutHead title={fullName} />
    <script
      type="text/javascript"
      src="https://static.eversign.com/js/embedded-signing.js"
    />
  </>
);

export default ContractPage;
