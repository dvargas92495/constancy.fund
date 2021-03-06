import getMeta from "~/_common/getMeta";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { Link as RemixLink, Outlet, useMatches } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import ListItemIcon from "~/_common/ListItemIcon";
import ListItemText from "~/_common/ListItemText";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";

const DRAWER_WIDTH = 255;
const DrawerRoot = styled.div`
  flex: 0 0 auto;
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  padding: 32px 50px;
  width: 100%;
  flex-grow: 1;
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

const TABS = [
  {
    text: "Home",
    iconName: "home",
    path: "",
  },
  {
    text: "Contract Templates",
    iconName: "book",
    path: "/contracts",
  },
  {
    text: "Emails",
    iconName: "mail",
    path: "emails",
  },
  {
    text: "Agreements",
    iconName: "fundraise",
    path: "agreements",
  },
  {
    text: "Requests",
    iconName: "arrow-right",
    path: "requests",
  },
  {
    text: "IPFS",
    iconName: "public",
    path: "ipfs",
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
  width: calc(100% - ${DRAWER_WIDTH}px);
  flex-direction:column;
  display:flex;
  min-height: 100%;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const List = styled.ul`
  padding: 0;
  & a {
    text-decoration: none;
    width: 100%;
  }
`;

const DefaultTitleBar = () => <PageTitle>Admin Dashboard</PageTitle>;

const Dashboard = () => {
  const matches = useMatches();
  const TitleBar =
    matches.reverse().find((m) => m.handle?.TitleBar)?.handle?.TitleBar ||
    DefaultTitleBar;
  return (
    <Root>
      <DrawerRoot>
        <DrawerContainer>
          <List>
            <MenuSidebarContainer>
              {TABS.map((t) => (
                <DashboardTab {...t} key={t.path} />
              ))}
            </MenuSidebarContainer>
          </List>
        </DrawerContainer>
      </DrawerRoot>
      <Main>
        <MainContainer>
          <TopBar>
            <InfoArea>
              <TitleBar />
            </InfoArea>
          </TopBar>
          <ContentContainer>
            <Outlet />
          </ContentContainer>
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

const AdminPage = (): React.ReactElement => (
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
      const email =
        user.emailAddresses.find((e) => user.primaryEmailAddressId === e.id)
          ?.emailAddress || "";
      if (!email.endsWith("@constancy.fund")) {
        return redirect("/user");
      }
      return {};
    });
};

export const meta = getMeta({ title: "Admin" });

export default AdminPage;
