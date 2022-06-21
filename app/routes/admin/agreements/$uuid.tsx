import { ActionFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getAgreementAsAdmin from "~/data/getAgreementAsAdmin.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
import deleteAgreementAsAdmin from "~/data/deleteAgreementAsAdmin.server";
import styled from "styled-components";
import { useState } from "react";
import { ethers } from "ethers";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";

const ButtonyLink = styled(Link)`
  padding: 8px 20px;
  border-color: unset;
  border-width: unset;
  border-style: unset;
  height: 35px;
  font-weight: normal;
  overflow: visible;
  white-space: nowrap;
  display: flex;
  min-width: fit-content;
  width: 80px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  background: ${(props) => props.theme.palette.color.purple};
  color: white;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;

  & * {
    display: flex;
  }

  :focus {
    outline: unset;
  }

  &: hover {
    opacity: 0.8;
  }
`;

const ActionsContainer = styled.div`
  gap: 16px;
  display: flex;
`;

const AdminAgreementPage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getAgreementAsAdmin>>>();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1>
        {data.type} - {data.status}
      </h1>
      <h3>
        {data.creatorName} ({data.creatorEmail})
      </h3>
      <h3>
        {data.investorName} ({data.investorEmail})
      </h3>
      <h6>Fundraise Details:</h6>
      <ul>
        {Object.entries(data.details).map(([k, v]) => (
          <li key={k}>
            <b>{k}:</b> {v}
          </li>
        ))}
      </ul>
      <h6>Agreement Details:</h6>
      <p>${data.amount} Investment</p>
      {data.address && (
        <p>
          Ethereuem Smart Contract deployed on {data.network} at {data.address}
        </p>
      )}
      <h6>Actions:</h6>
      <ActionsContainer>
        <ButtonyLink to={`/contract/${data.uuid}`}>Go</ButtonyLink>
        <Form method={"delete"}>
          <PrimaryAction type={"submit"} label={"Delete"} />
        </Form>
        {data.address && (
          <>
            <PrimaryAction
              label={"Invest"}
              onClick={() => {
                const provider = new ethers.providers.Web3Provider(
                  window.ethereum
                );
                const contract = new ethers.Contract(
                  data.address || "",
                  data.contractJson.abi,
                  provider.getSigner()
                );
                return contract
                  .investorWithdraw()
                  .then((tx: ethers.ContractTransaction) => tx.wait())
                  .then(() => setLoading(false));
              }}
            />
            <PrimaryAction
              label={"Transact"}
              onClick={() => {
                const provider = new ethers.providers.Web3Provider(
                  window.ethereum
                );
                const contract = new ethers.Contract(
                  data.address || "",
                  data.contractJson.abi,
                  provider.getSigner()
                );
                return contract
                  .investorWithdraw()
                  .then((tx: ethers.ContractTransaction) => tx.wait())
                  .then(() => setLoading(false));
              }}
            />
          </>
        )}
      </ActionsContainer>
    </div>
  );
};

export const loader = createAuthenticatedLoader(getAgreementAsAdmin);

export const action: ActionFunction = ({ request, params }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        return new Response("No valid user found", { status: 401 });
      }
      if (request.method === "DELETE") {
        return deleteAgreementAsAdmin({
          userId,
          uuid: params["uuid"] || "",
        })
          .then(() => redirect(`/admin/agreements?delete=true`))
          .catch((e: Error) => {
            throw new Response(`Unexpected error: ${e.name}\n${e.stack}`);
          });
      } else {
        throw new Response(`Method ${request.method} not found`, {
          status: 404,
        });
      }
    });
};

export default AdminAgreementPage;
