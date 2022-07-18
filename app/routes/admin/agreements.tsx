import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getAllAgreements from "~/data/getAllAgreements.server";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
import Toast from "~/_common/Toast";
import Table from "~/_common/Table";

const TableContainer = styled.div`
  display: flex;
  gap: 64px;
  overflow: hidden;
`;

const OutletContainer = styled.div`
  overflow-x: auto;
`;

const DeleteSuccessNotification = () => {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (searchParams.get("delete") === "true") setIsOpen(true);
  }, [searchParams]);
  return (
    <Toast
      open={isOpen}
      onClose={() => setIsOpen(false)}
      color={"success"}
      position={"TOP_CENTER"}
    >
      Successfully deleted agreement!
    </Toast>
  );
};

const AdminAgreementsPage = () => {
  return (
    <div>
      <h1>View all of the agreements below.</h1>
      <TableContainer>
        <Table />
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </TableContainer>
      <DeleteSuccessNotification />
    </div>
  );
};

export const loader: LoaderFunction =
  createAuthenticatedLoader(getAllAgreements);

export default AdminAgreementsPage;
