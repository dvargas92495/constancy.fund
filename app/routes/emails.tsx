import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import styled from "styled-components";

export const loader: LoaderFunction = () => {
  return { development: process.env.NODE_ENV === "development" };
};

const RootContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 60vw;
`;

const EmailsRoute = () => {
  const dev = useLoaderData<{ development: boolean }>().development;
  return dev ? (
    <RootContainer>
      <div>
        <ul>
          <li>
            <Link to={"/emails/invitation-to-fund"}>Invitation To Fund</Link>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </RootContainer>
  ) : (
    <div>This page is only available in development!</div>
  );
};

export default EmailsRoute;
