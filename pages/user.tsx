import { LayoutHead, themeProps } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import React, { useState } from "react";
import { SignedIn,  UserButton, UserProfile } from "@clerk/clerk-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ContractIcon from "@mui/icons-material/Note";
import SettingsIcon from "@mui/icons-material/Settings";
import H1 from "@dvargas92495/ui/dist/components/H1";
import GlobalStyles from "@mui/material/GlobalStyles";

const ProfileContent = () => {
  return (
    <>
      <H1>Profile</H1>
      <style>{`.cl-component.cl-user-profile nav.cl-navbar, .cl-component div.cl-page-heading {
  display: none;
}

.cl-component.cl-user-profile div.cl-content {
  margin: unset;
  padding-bottom: 2em;
  font-family: "Century Gothic", sans-serif
}`}</style>
      <UserProfile />
    </>
  );
};

const DRAWER_WIDTH = 255;
const TABS = [
  { text: "My Profile", Icon: HomeIcon, content: ProfileContent },
  {
    text: "My Contracts",
    Icon: ContractIcon,
    content: () => <div>Coming Soon!</div>,
  },
  {
    text: "Settings",
    Icon: SettingsIcon,
    content: () => <div>Coming Soon!</div>,
  },
] as const;

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const TabContent = TABS[tab].content;
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          backgroundColor: themeProps.background,
        }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
          <UserButton />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#363740",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Link href="/">Home</Link>
        </Toolbar>
        <List>
          {TABS.map(({ text, Icon }, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                setTab(index);
              }}
              sx={{
                display: "flex",
                background: index === tab ? "#0000000a" : "unset",
                borderLeft: index === tab ? "2px solid #DDE2FF" : "unset",
                paddingLeft: "32px",
                py: "20px",
                fontSize: 14,
                color: "#A4A6B3",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          color: "text.primary",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        <Toolbar />
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <TabContent />
        </Box>
      </Box>
    </Box>
  );
};

const globalStyles = (
  <GlobalStyles
    styles={{
      html: { height: "100%" },
      body: { height: "100%" },
      "body > div[data-reactroot]": { height: "100%" },
    }}
  />
);

const UserPage = (): React.ReactElement => (
  <Document themeProps={themeProps}>
    {globalStyles}
    <SignedIn>
      <Dashboard />
    </SignedIn>
    <RedirectToLogin />
  </Document>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"User"} styles={clerkUserProfileCss} />
);
export default UserPage;
