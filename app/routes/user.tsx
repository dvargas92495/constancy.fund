import getMeta from "~/_common/getMeta";
import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Link as RemixLink, LoaderFunction, Outlet, redirect } from "remix";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import ListItemIcon from "~/_common/ListItemIcon";
import ListItemText from "~/_common/ListItemText";
import { getAuth } from "@clerk/remix/ssr.server";

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

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
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
        <List
          sx={{
            a: {
              textDecoration: "none",
              width: "100%",
            },
          }}
        >
          <MenuSidebarContainer>
            {TABS.map((t) => (
              <DashboardTab {...t} key={t.path} />
            ))}
          </MenuSidebarContainer>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 2,
          color: "text.primary",
          height: "fit-content",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

const globalStyles = (
  <GlobalStyles
    styles={{
      "body > div#root": { justifyContent: "unset" },
    }}
  />
);

const UserPage = (): React.ReactElement => (
  <>
    {globalStyles}
    <Dashboard />
  </>
);

export const loader: LoaderFunction = ({ request }) => {
  return getAuth(request).then((authData) => {
    if (!authData.userId) {
      return redirect("/login");
    }
    return {};
  });
};

export const meta = getMeta({ title: "User" });

export default UserPage;
