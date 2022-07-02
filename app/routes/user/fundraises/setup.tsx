import { Outlet, useMatches } from "@remix-run/react";
import styled from "styled-components";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

const Container = styled.div`
  max-width: 1000px;
`;

const UserFundraisesSetup = () => {
  const matches = useMatches();
  const title = matches.reverse().find((m) => m.handle?.title)?.handle?.title;
  return (
    <Container>
      <TopBar>
        <InfoArea>
          <PageTitle>{title || "User Dashboard"}</PageTitle>
        </InfoArea>
      </TopBar>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </Container>
  );
};

export default UserFundraisesSetup;
