import getMeta from "~/_common/getMeta";
import React from "react";
import Drawer from "@mui/material/Drawer";
import { createGlobalStyle } from "styled-components";
import { Link as RemixLink, LoaderFunction, Outlet, redirect } from "remix";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import ListItemIcon from "~/_common/ListItemIcon";
import ListItemText from "~/_common/ListItemText";

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

const DRAWER_WIDTH = 255;
const TABS = [
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
] as const;

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
  height: fit-content;
  width: calc(100% - ${DRAWER_WIDTH}px);
  flex-direction:column;
  display:flex;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flexdirection: column;
`;

const List = styled.ul`
  & a {
    text-decoration: none;
    width: 100%;
  }
`;

const Dashboard = () => {
  return (
    <Root>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "palette.color.white",
            borderRight: "1px solid #f0f0f0",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <MenuSidebarContainer>
            {TABS.map((t) => (
              <DashboardTab {...t} key={t.path} />
            ))}
          </MenuSidebarContainer>
        </List>
      </Drawer>
      <Main>
        <MainContainer>
          <Outlet />
        </MainContainer>
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
    .then((authData) => {
      if (!authData.userId) {
        return redirect("/login");
      }
      return {};
    });
};

export const meta = getMeta({ title: "User" });

export default UserPage;
