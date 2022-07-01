import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import axios from "axios";
import styled from "styled-components";
import apiInfuraIpfs from "~/data/apiIpfsInfura.server";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import listIpfsFiles from "~/data/listIpfsFiles.server";
import verifyAdminUser from "~/data/verifyAdminUser.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";

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

const IPFSPage = () => {
  const { files } = useLoaderData<Awaited<ReturnType<typeof listIpfsFiles>>>();
  const fetcher = useFetcher();
  return (
    <div>
      <h1>View all of the ipfs files below.</h1>
      <TableContainer>
        <Table>
          <thead>
            <HeaderRow>
              <Header>Contract</Header>
              <Header>Hash</Header>
              <Header>Is Pinned</Header>
              <Header>Pin?</Header>
            </HeaderRow>
          </thead>
          <tbody>
            {files.map((a, index) => (
              <Row key={a.hash} index={index}>
                <Cell>{a.contract}</Cell>
                <Cell>{a.hash}</Cell>
                <Cell>{`${a.pinned}`}</Cell>
                <Cell>
                  <PrimaryAction
                    label={"Pin"}
                    onClick={() =>
                      fetcher.submit({ hash: a.hash }, { method: "put" })
                    }
                  />
                </Cell>
              </Row>
            ))}
          </tbody>
        </Table>
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </TableContainer>
    </div>
  );
};

export const loader: LoaderFunction = createAuthenticatedLoader(listIpfsFiles);

export const action: ActionFunction = ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        return new Response("No valid user found", { status: 401 });
      }
      await verifyAdminUser(userId);
      if (request.method === "PUT") {
        const formData = await request.formData();
        const hash = formData.get("hash");
        return axios
          .get(`https://ipfs.io/ipfs/${hash}`)
          .then((res) => {
            return apiInfuraIpfs(`pin/add?arg=${hash}`, {
              files: Buffer.from(JSON.stringify(res.data)),
            }).catch((e) => {
              throw new Response(
                `Pin adding error: ${e.response?.data?.Message || e.message}\n${
                  e.stack
                }`
              );
            });
          })
          .then(() => redirect("/admin/ipfs"))
          .catch((e) => {
            if (e instanceof Response) throw e;
            throw new Response(
              `Unexpected error: ${e.response?.data || e.message || e}\n${
                e.stack
              }`
            );
          });
      } else {
        throw new Response(`Method ${request.method} not found`, {
          status: 404,
        });
      }
    });
};

export default IPFSPage;
