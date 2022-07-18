import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import styled from "styled-components";
import getContracts from "~/data/getContracts.server";
import UserAvatar from "~/_common/UserAvatar";

const Container = styled.div`
  margin-top: 256px;
`;

const ContractPage = () => {
  const { contracts } =
    useLoaderData<Awaited<ReturnType<typeof getContracts>>>();
  return (
    <Container>
      <UserAvatar />
      {!contracts?.length ? (
        <div>You do not have any live contracts</div>
      ) : (
        <ul>
          {contracts.map(({ id, agreementUuid }) => (
            <li key={id}>
              <Link to={agreementUuid}>Go to contract</Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  return getContracts({ userId });
};

export default ContractPage;
