import type { LoaderFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import listRequests from "~/data/listRequests.server";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
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

const AdminRequestsPage = () => {
  const { streams } = useLoaderData<Awaited<ReturnType<typeof listRequests>>>();
  const navigate = useNavigate();
  return (
    <div>
      <h1>View all of the latest requests below.</h1>
      <TableContainer>
        <Table>
          <thead>
            <HeaderRow>
              <Header>Created</Header>
              <Header>Last Updated</Header>
              <Header>Name</Header>
            </HeaderRow>
          </thead>
          <tbody>
            {streams.map((a, index) => (
              <Row key={a.arn} index={index}>
                <Cell>{new Date(a.creationTime).toLocaleString()}</Cell>
                <Cell>{new Date(a.lastEventTimestamp).toLocaleString()}</Cell>
                <Cell>
                  <a
                    href={`https://${
                      a.region
                    }.console.aws.amazon.com/cloudwatch/home?region=${
                      a.region
                    }#logsV2:log-groups/log-group/${encodeURIComponent(a.arn)}`}
                  >
                    {a.logStreamName}
                  </a>
                </Cell>
              </Row>
            ))}
          </tbody>
        </Table>
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </TableContainer>
      <DeleteSuccessNotification />
    </div>
  );
};

export const loader: LoaderFunction = createAuthenticatedLoader(listRequests);

export default AdminRequestsPage;
