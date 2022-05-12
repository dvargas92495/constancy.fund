import type { LoaderFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import styled from "styled-components";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getAllAgreements from "~/data/getAllAgreements.server";
import DefaultCatchBoundary from "~/_common/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import Toast from "~/_common/Toast";

const Table = styled.table`
  border-collapse: collapse;
  text-indent: 0;
  border-width: 2px;
  border-color: #888888;
  border-style: solid;
`;

const Row = styled.tr<{ index: number }>`
  background: ${(props) => (props.index % 2 === 0 ? "#eeeeee" : "#dddddd")};
  cursor: pointer;

  &:hover {
    background: #cccccc;
  }
`;

const Cell = styled.td`
  padding: 12px;
`;

const Header = styled.th`
  padding: 12px;
`;

const HeaderRow = styled.tr`
  background: #dddddd;
`;

const TableContainer = styled.div`
  display: flex;
  gap: 64px;
`;

const DeleteSuccessNotification = () => {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(searchParams.get("delete") === "true");
  return (
    <Toast open={isOpen} onClose={() => setIsOpen(false)} color={"success"}>
      Successfully deleted agreement!
    </Toast>
  );
};

const AdminAgreementsPage = () => {
  const { agreements } =
    useLoaderData<Awaited<ReturnType<typeof getAllAgreements>>>();
  const navigate = useNavigate();
  return (
    <div>
      <h1>View all of the agreements below.</h1>
      <TableContainer>
        <Table>
          <thead>
            <HeaderRow>
              <Header>Type</Header>
              <Header>Status</Header>
              <Header>Creator Name</Header>
              <Header>Investor Name</Header>
              <Header>Amount</Header>
            </HeaderRow>
          </thead>
          <tbody>
            {agreements.map((a, index) => (
              <Row
                key={a.uuid}
                index={index}
                onClick={() => navigate(`/admin/agreements/${a.uuid}`)}
              >
                <Cell>{a.type}</Cell>
                <Cell>{a.status}</Cell>
                <Cell>{a.userId}</Cell>
                <Cell>{a.name}</Cell>
                <Cell>${a.amount}</Cell>
              </Row>
            ))}
          </tbody>
        </Table>
        <Outlet />
      </TableContainer>
      <DeleteSuccessNotification />
    </div>
  );
};

export const loader: LoaderFunction =
  createAuthenticatedLoader(getAllAgreements);

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default AdminAgreementsPage;
