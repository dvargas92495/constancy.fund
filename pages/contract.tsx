import Layout, { LayoutHead } from "./_common/Layout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import H1 from "@dvargas92495/ui/dist/components/H1";
import Body from "@dvargas92495/ui/dist/components/Body";
import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useState } from "react";
import type { Handler as GetHandler } from "../functions/eversign/get";
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
          signed?: (a: unknown) => void;
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
  setSigned,
}: {
  url: string;
  setSigned: (b: boolean) => void;
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
          signed: (a) => {
            setSigned(true);
          },
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
  const getEversign = useHandler<GetHandler>({
    path: "eversign",
    method: "GET",
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const signer = params.get("signer");
    if (id && signer) {
      getEversign({ id, signer })
        .then((r) => {
          setLoading(false);
          setAgreementUuid(r.agreementUuid);
          setUserId(r.userId);
          setType(r.type);
          setUrl(r.url);
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
            <EversignEmbed url={url} setSigned={setSigned} />
            <Box display={"flex"}>
              <Button
                variant={"contained"}
                color={"primary"}
                // onClick={onSubmit}
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
              We are waiting for the creator to confirm this investment and send you an
              email with next steps when this happened.
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