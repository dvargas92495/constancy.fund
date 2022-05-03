import getMeta from "~/_common/getMeta";
import React from "react";

import Icon from "~/_common/Icon";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import UserAvatar from "~/_common/UserAvatar";
import getContractOwner from "~/data/getContractOwner.server";
import Section from "~/_common/Section";

const EversignEmbedContainer = styled.div`
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  overflow: hidden;

  & > div {
    margin-bottom: 0px;
  }

  & iframe {
    border: none;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
  height: 100%;
`;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  flex-grow: 1;
`;

const TopBarProfile = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 10;
`;

const TermSheetTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  padding-top: 130px;
  grid-gap: 15px;
`;

const BackButton = styled.div`
  display: flex;
  grid-gap: 5px;
  width: fit-content;
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 6px 12px;
  z-index: 1001;
  align-items: center;
  cursor: pointer;
  color: black;
`;

const ProfileTitle = styled.div<{ scroll?: number }>`
  color: ${(props) => props.theme.palette.color.darkerText};
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ContractPage = (): React.ReactElement => {
  const { creatorUrl } = useLoaderData<{ creatorUrl: string }>();
  const profileTitle = useMatches().find(m => m.handle)?.handle?.title as string;
  return (
    <ProfileContainer>
      <Link to={creatorUrl}>
        <BackButton>
          <Icon heightAndWidth={"20px"} name={"backArrow"} />
          Back to Creator Profile
        </BackButton>
      </Link>
      <TopBarProfile>
        <UserAvatar />
        <TermSheetTitleBox>
          <ProfileTitle>{profileTitle}</ProfileTitle>
        </TermSheetTitleBox>
      </TopBarProfile>
      <ProfileBottomContainer paddingTop={"20px"}>
        <Section>
          <EversignEmbedContainer>
            <Outlet />
          </EversignEmbedContainer>
        </Section>
      </ProfileBottomContainer>
    </ProfileContainer>
  );
};

export const loader: LoaderFunction = async ({ params }) => {
  const uuid = params["uuid"] || "";
  return getContractOwner({
    uuid,
  }).then(({ userId }) => ({
    creatorUrl: `/creator/${userId}?agreement=${uuid}`,
  }));
};

export const meta = getMeta({
  title: "Contract",
});

export const ErrorBoundary = DefaultErrorBoundary;

export default ContractPage;
