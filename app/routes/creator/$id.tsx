import React from "react";
import { Outlet } from "remix";
import styled from "styled-components";

export const TopBarProfile = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 10;
`;

export const ProfileTitle = styled.div<{ scroll?: number }>`
  color: ${(props) => props.theme.palette.color.darkerText};
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
`;

export const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

const CreatorPublicContainer = styled.div`
  width: 100%;
`;

export const IconContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
`;

const CreatorPage = (): React.ReactElement => {
  return (
    <CreatorPublicContainer>
      <ProfileContainer>
        <Outlet />
      </ProfileContainer>
    </CreatorPublicContainer>
  );
};

export default CreatorPage;
