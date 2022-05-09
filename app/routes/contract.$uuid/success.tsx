import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import styled from "styled-components";
import { SecondaryAction } from "~/_common/SecondaryAction";
import {
  useNavigate,
  useLoaderData,
  useParams,
  useFetcher,
} from "@remix-run/react";
import getContractPaymentPreferences from "~/data/getContractPaymentPreferences.server";
import { useState } from "react";
import Toast from "~/_common/Toast";
import signAgreement from "~/data/signAgreement.server";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import DefaultCatchBoundary from "~/_common/DefaultCatchBoundary";
import SuccessSnackbar from "~/_common/SuccessSnackbar";

const SignedContainer = styled.div`
  padding: 32px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ContractSuccessPage = () => {
  const { preferences } = useLoaderData<{
    isInvestor: boolean;
    preferences: Record<string, Record<string, string>>;
  }>();
  const navigate = useNavigate();
  const params = useParams();
  const [toastMessage, setToastMessage] = useState("");
  const fetcher = useFetcher();
  const submitting = fetcher.state === "submitting";
  return (
    <div>
      <SignedContainer>
        <p>You have successfully signed the contract.</p>
        <Actions>
          <SecondaryAction
            label={"Resend Email"}
            onClick={() => {
              fetcher.submit({ operation: "resend" }, { method: "post" });
            }}
            isLoading={submitting}
          />
          <SecondaryAction
            label={"Download Contract"}
            onClick={() => {
              setToastMessage("Feature coming soon");
            }}
            isLoading={submitting}
          />
          {Object.keys(preferences).map((pref) => (
            <div key={pref}>
              {pref === "ethereum" && (
                <SecondaryAction
                  label={"View Ethereum Smart Contract"}
                  onClick={() => navigate(`/contract/${params.uuid}/ethereum`)}
                  isLoading={submitting}
                />
              )}
            </div>
          ))}
        </Actions>
      </SignedContainer>
      <Toast
        open={!!toastMessage}
        onClose={() => setToastMessage("")}
        color="warning"
        position="TOP_CENTER"
      >
        {toastMessage}
      </Toast>
      <SuccessSnackbar message="Successfully resent email!" fetcher={fetcher} />
    </div>
  );
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  return getContractPaymentPreferences({
    uuid: params["uuid"] || "",
    isInvestor: !userId,
  }).then((preferences) => ({ preferences, isInvestor: !userId }));
};

export const action: ActionFunction = async ({ request, params }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  const body = await request.formData();
  const operation = body.get("operation");
  const uuid = params["uuid"] || "";
  switch (operation) {
    case "resend":
      return signAgreement({ agreementUuid: uuid, userId }).catch((e) => {
        throw new Response(e.message, { status: 500 });
      });
    default:
      throw new Response(`Unknown operation: ${operation}`, { status: 400 });
  }
};

export const handle = {
  title: "Success!",
};

export const ErrorBoundary = DefaultErrorBoundary;

export const CatchBoundary = DefaultCatchBoundary;

export default ContractSuccessPage;
