import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getAgreementAsAdmin from "~/data/getAgreementAsAdmin.server";
import DefaultCatchBoundary from "~/_common/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import { PrimaryAction } from "~/_common/PrimaryAction";
import deleteAgreementAsAdmin from "~/data/deleteAgreementAsAdmin.server";

const AdminAgreementPage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getAgreementAsAdmin>>>();
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
          <li>
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
      <Form method={"delete"}>
        <PrimaryAction type={"submit"} label={"Delete"} />
      </Form>
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

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default AdminAgreementPage;
