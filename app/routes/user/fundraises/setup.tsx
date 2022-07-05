import { Outlet } from "@remix-run/react";
import styled from "styled-components";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

const Container = styled.div`
  max-width: 1000px;
`;

const UserFundraisesSetup = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default UserFundraisesSetup;
