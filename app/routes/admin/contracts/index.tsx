import { LoaderFunction } from "@remix-run/node";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import Table from "~/_common/Table";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
import getAllContracts from "~/data/getAllContracts.server";

const ContractsTable = () => {
  return <Table />;
};

export const loader: LoaderFunction =
  createAuthenticatedLoader(getAllContracts);

export default ContractsTable;
