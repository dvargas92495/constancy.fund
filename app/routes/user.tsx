import getMeta from "~/_common/getMeta";
import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import {
  Link as RemixLink,
  Outlet,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import ListItemIcon from "~/_common/ListItemIcon";
import ListItemText from "~/_common/ListItemText";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ActionButton from "~/_common/ActionButton";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { SecondaryAction } from "~/_common/SecondaryAction";
import DashboardActionContextProvider, {
  useDashboardActions,
} from "~/_common/DashboardActionContext";

const DRAWER_WIDTH = 255;
const DrawerRoot = styled.div`
  flex: 0 0 auto;
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;
`;

const DrawerContainer = styled.div`
  width: ${DRAWER_WIDTH}px;
  box-sizing: border-box;
  border-right: 1px solid #f0f0f0;
  background-color: #fff;
  color: #292c38;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 0 auto;
  z-index: 1200;
  position: fixed;
  top: 0;
  outline: 0;
  left: 0;
`;

const MenuListItem = styled.div`
  height: 60px;
  padding: 0 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px;
  border-radius: 8px;
  grid-gap: 10px;
  width: fill-available;
  color: ${(props) => props.theme.palette.color.lighterText};

  &:hover {
    background: ${(props) => props.theme.palette.color.backgroundColorDarker};
  }

  > a {
    width: fill-available;
  }
`;

const MenuSidebarContainer = styled.div`
  display: flex;
  padding: 100px 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const TABS: {
  text: string;
  iconName: Parameters<typeof Icon>[0]["name"];
  path: string;
}[] = [
  {
    text: "My Profile",
    iconName: "home",
    path: "",
  },
  {
    text: "My Fundraise",
    iconName: "fundraise",
    path: "fundraises",
  },
  {
    text: "Settings",
    iconName: "settings",
    path: "settings",
  },
];

const DashboardTab = ({ path, iconName, text }: typeof TABS[number]) => {
  return (
    <RemixLink to={path}>
      <MenuListItem>
        <ListItemIcon>
          <Icon heightAndWidth="20px" name={iconName} />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuListItem>
    </RemixLink>
  );
};

const Root = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Main = styled.main`
  flex-grow: 1,
  padding-bottom: 16px,
  color: text.primary;
  height: 100%;
  width: calc(100% - ${DRAWER_WIDTH}px);
  flex-direction:column;
  display:flex;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const List = styled.ul`
  padding: 0;
  & a {
    text-decoration: none;
    width: 100%;
  }
`;

const DashboardContentContainer = styled.div`
  overflow: auto;
`;

const DashboardTopBar = () => {
  const matches = useMatches();
  const { handle = {}, data, params } = matches[matches.length - 1];
  const { showPrimary, showSecondary, setShowPrimary, setShowSecondary } =
    useDashboardActions();
  const submit = useSubmit();
  const { TopBarWidgets } = handle;
  return (
    <TopBar>
      <InfoArea>
        <PageTitle>{handle.title}</PageTitle>
        <ActionButton>
          {TopBarWidgets && <TopBarWidgets data={data} />}
          {showSecondary && (
            <SecondaryAction
              onClick={() => handle.onSecondary?.({ data, params })}
              label={handle?.secondaryLabel}
              height={"40px"}
              width={"180px"}
              fontSize={"16px"}
            />
          )}
          {showPrimary && (
            <PrimaryAction
              label={handle.primaryLabel}
              height={"40px"}
              width={"130px"}
              fontSize={"16px"}
              onClick={() => submit(document.querySelector("form"))}
            />
          )}
        </ActionButton>
      </InfoArea>
    </TopBar>
  );
};

const Dashboard = () => {
  const { isAdmin } = useLoaderData<{ isAdmin: boolean }>();
  return (
    <Root>
      <DrawerRoot>
        <DrawerContainer>
          <List>
            <MenuSidebarContainer>
              {TABS.map((t) => (
                <DashboardTab {...t} key={t.path} />
              ))}
              {isAdmin && (
                <DashboardTab
                  path={"/admin"}
                  text={"Admin Dashboard"}
                  iconName={"info"}
                />
              )}
            </MenuSidebarContainer>
          </List>
        </DrawerContainer>
      </DrawerRoot>
      <Main>
        <DashboardActionContextProvider>
          <MainContainer>
            <DashboardTopBar />
            <DashboardContentContainer>
              <Outlet />
            </DashboardContentContainer>
          </MainContainer>
        </DashboardActionContextProvider>
      </Main>
    </Root>
  );
};

const GlobalStyles = createGlobalStyle`
  body > div#root { 
    justify-content: unset; 
  }
`;

const UserPage = (): React.ReactElement => (
  <>
    <GlobalStyles />
    <Dashboard />
  </>
);

export const loader: LoaderFunction = ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async (authData) => {
      const { userId } = authData;
      if (!userId) {
        return redirect("/login");
      }
      const user = await import("@clerk/clerk-sdk-node").then((clerk) =>
        clerk.users.getUser(userId)
      );
      const isAdmin = user.emailAddresses.some((e) =>
        e.emailAddress?.endsWith("constancy.fund")
      );
      return { isAdmin };
    });
};

export const meta = getMeta({ title: "User" });

export default UserPage;
