import { useEffect, useState } from "react";
import signAgreement from "~/data/signAgreement.server";
import eversign from "../../external/eversign";

import styled from "styled-components";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import getContract from "../../data/getContract.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
import Toast from "~/_common/Toast";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";

const LoadingBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CONTAINER_ID = "eversign-embed";
const EversignBox = styled.div`
  height: 60vh;
  marginbottom: 32px;
`;

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
      eversign.open({
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
    <EversignBox id={CONTAINER_ID}>
      {loading && (
        <LoadingBox>
          <LoadingIndicator />
        </LoadingBox>
      )}
    </EversignBox>
  );
};

type Data = Awaited<ReturnType<typeof getContract>>;

const ContractContentPage = () => {
  const {
    contractUuid,
    url = "",
    isInvestor,
  } = useLoaderData<Data & { isInvestor: boolean }>();
  const [signed, setSigned] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fetcher = useFetcher();
  useEffect(() => {
     if (fetcher.data?.success) {
      setSigned(true);
      setSnackbarOpen(true);
    }
  }, [fetcher.data]);
  return (
    <>
      <EversignEmbed
        url={url}
        onSign={() => {
          fetcher.submit({}, { method: "put" });
        }}
      />
      {signed && !isInvestor && (
        <PrimaryAction
          onClick={() =>
            window.location.assign(`/user/fundraises/contract/${contractUuid}`)
          }
          label={"Back to Dashboard"}
        />
      )}
      <Toast
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        color="success"
        position="TOP_CENTER"
      >
        {isInvestor
          ? "We are waiting for the creator to confirm this investment and send you an email with next steps when this happened."
          : "Congratulations! Both you and the investor have both signed the agreement! Now go create something awesome"}
      </Toast>
    </>
  );
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  const uuid = params["uuid"] || "";
  return getContract({
    uuid,
    signer: userId ? 2 : 1,
  }).then(({ signed, ...data }) =>
    signed
      ? redirect(`/contract/${uuid}/success`)
      : { ...data, isInvestor: !userId }
  );
};

export const action: ActionFunction = async ({ params }) => {
  const agreementUuid = params.uuid;
  if (!agreementUuid)
    throw new Response("`agreementUuid` is required", { status: 400 });
  if (typeof agreementUuid !== "string")
    throw new Response("`agreementUuid` must be a string", { status: 400 });
  return signAgreement({ agreementUuid }).then(() =>
    redirect(`/contract/${agreementUuid}/success`)
  );
};

export const ErrorBoundary = DefaultErrorBoundary;

export const handle = {
  title: "Sign the agreement",
};

export default ContractContentPage;
