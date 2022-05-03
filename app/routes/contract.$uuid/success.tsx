import type { LoaderFunction } from "@remix-run/node";
import styled from "styled-components";
import { SecondaryAction } from "~/_common/SecondaryAction";
import { useNavigate, useLoaderData, useParams } from "@remix-run/react";
import getContractPaymentPreferences from "~/data/getContractPaymentPreferences.server";
import { useState } from "react";
import Toast from "~/_common/Toast";

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
  return (
    <div>
      <SignedContainer>
        <p>You have successfully signed the contract.</p>
        <Actions>
          <SecondaryAction
            label={"Resend Email"}
            onClick={() => {
              setToastMessage("Feature coming soon...");
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

export const handle = {
  title: "Success!",
};

export default ContractSuccessPage;
