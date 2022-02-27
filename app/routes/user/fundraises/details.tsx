import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import { Outlet, Form, redirect, ActionFunction } from "remix";
import { PrimaryAction } from "~/_common/PrimaryAction";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import ErrorSnackbar from "~/_common/ErrorSnackbar";
import { getAuth } from "@clerk/remix/ssr.server";
import createFundraise from "~/data/createFundraise.server";
import styled from "styled-components";
import type { FundraiseId } from "../../../../db/fundraise_types";

const Container = styled(Form)`
  max-width: 1000px;
`;

const UserFundraiseDetails = () => {
  return (
    <Container method="post">
      <TopBar>
        <InfoArea>
          <PageTitle>Define Contract Terms</PageTitle>
          <PrimaryAction type="submit" label={"Save & Preview Contract"} />
        </InfoArea>
      </TopBar>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <ErrorSnackbar />
    </Container>
  );
};

export const action: ActionFunction = ({ request }) => {
  return getAuth(request)
    .then(async ({ userId }) => {
      if (!userId) {
        return new Response("No valid user found", { status: 401 });
      }
      const formData = await request.formData();
      const data = Object.fromEntries(
        Array.from(formData.keys()).map((k) => [
          k,
          formData.getAll(k).map((v) => v as string),
        ])
      );
      return createFundraise({
        userId,
        data,
        id: new URL(request.url).pathname.split("/").slice(-1)[0] as FundraiseId,
      }).then((uuid) => redirect(`/user/fundraises/preview/${uuid}`));
    })
    .catch((e) => ({ success: false, error: e.message }));
};

export default UserFundraiseDetails;
