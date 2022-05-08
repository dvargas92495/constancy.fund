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
          />
          <SecondaryAction
            label={"Download Contract"}
            onClick={() => {
              setToastMessage("Feature coming soon");
            }}
          />
          {Object.keys(preferences).map((pref) => (
            <div key={pref}>
              {pref === "ethereum" && (
                <SecondaryAction
                  label={"View Ethereum Smart Contract"}
                  onClick={() => navigate(`/contract/${params.uuid}/ethereum`)}
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
      return signAgreement({ agreementUuid: uuid, userId });
    default:
      throw new Response(`Unknown operation: ${operation}`, { status: 400 });
  }
};

export const handle = {
  title: "Success!",
};

export default ContractSuccessPage;
