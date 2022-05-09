import { PrimaryAction } from "~/_common/PrimaryAction";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import styled from "styled-components";
import { Outlet, Form, useMatches } from "remix";

const Container = styled(Form)`
  max-width: 1000px;
`;

const UserFundraiseDetails = () => {
  const matches = useMatches();
  return (
    <Container
      method="post"
      replace={false}
      action={matches.slice(-1)[0].pathname}
    >
      <TopBar>
        <InfoArea>
          <PageTitle>Define Contract Terms</PageTitle>
          <PrimaryAction type="submit" label={"Save & Preview Contract"} />
        </InfoArea>
      </TopBar>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </Container>
  );
};

export default UserFundraiseDetails;
