import React from "react";
import DefaultLayout from "@dvargas92495/ui/dist/components/Layout";
import type { MetaFunction } from "remix";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import { SignedIn } from "@clerk/clerk-react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const themeProps = {
  palette: {
    // default MUI palette fields
    primary: {
      main: "#347AE2",
    },
    secondary: {
      main: "#ff00ff",
    },
    background: {
      default: "#F8FBFF",
    },
    warning: {
      main: "#ff9090",
    },
    text: {
      primary: "#292C38",
      secondary: "#73778B",
      tertiary: '#96A0B5',
    },
    // All custom fields
    color: {
      grey: "#e0e0e0",
      purple: "#347AE2",
      white: "#fff",
      lightgrey: "#f0f0f0",
      darkgrey: "#545454",
      black: "#000",
      overlay: {
        background: "rgba(0, 0, 0, 0.1)",
        dialog: "white",
      },
      lightblack: "#292C38",
      lineGrey: "#ECEFF4",
      lineLightGrey: "#E0E5ED",
      iconColor: "#96A0B5",
      darkerIconColor: "#7d8598",
      lightHover: "#F4F9FF",
      backgroundHighlight: "#e6f1ff",
      darkhover: "#E5F0FF",
      darkerText: "#292C38",
      lighterText: "#96A0B5",
      backgroundColor: "#F8FBFF",
      backgroundColorDarker: "#e5f0ff70",
      darkerBlue: "#5E6278",
      blue: "2563EB",
    },
  },
  typography: {
    fontFamily: ["Inter", 'sans-serif'].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
      margin: "3rem 0",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      margin: "2.5rem 0",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      margin: "2rem 0",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
      margin: "1.75rem 0",
    },
    h5: {
      fontWeight: 600,
      margin: "1.5rem 0",
    },
    h6: {
      fontWeight: 600,
      margin: "1.25rem 0",
    },
    subtitle1: {
      fontSize: "1.25rem",
    },
  },
};

const GlobalStyle = createGlobalStyle<{theme: typeof themeProps}>`

  * {
      font-family: "Inter" !important;
    } 

    html { font-family: "Inter", "system-ui" !important; }

    @supports (font-variation-settings: normal) {
      html { font-family: "Inter", "system-ui" !important; }
    }

    & .MuiPopover-paper {
      box-shadow: 0px 22px 26px 18px rgba(0, 0, 0, 0.03) !important;
      width: 300px !important;
    }

    & .MuiMenuItem-root {
        font-size: 14px !important;
        border-radius: 8px !important;
        margin: 0 10px !important;
        padding: 0 10px !important;
        display: flex !important;
        height: 60px !important;
        align-items: center !important;
        justify-content: flex-start !important;
        color: ${props => props.theme.palette.color.darkerText};

        &:hover {
          background: ${props => props.theme.palette.color.backgroundColorDarker} !important;
        }
      }
    }

    & .Mui-selected {
        background: ${props => props.theme.palette.color.backgroundHighlight} !important;
      }
    }

    & .Mui-focusVisible {
        background: ${props => props.theme.palette.color.backgroundColorDarker} !important;
      }
    }
`

const Layout: React.FC<{ privatePage?: boolean }> = ({
  children,
  privatePage,
}) => {
  return (
    <ThemeProvider theme={themeProps}>
    <GlobalStyle />
      {privatePage ? (
        <Document themeProps={themeProps}>
          <SignedIn>{children}</SignedIn>
          <RedirectToLogin />
        </Document>
      ) : (
        <DefaultLayout homeIcon={"Home"} themeProps={themeProps}>
          {children}
        </DefaultLayout>
      )}
    </ThemeProvider>
  );
};

export const getMeta =
  ({
    title: pageTitle,
    description = "",
    img = "",
  }: {
    title: string;
    description?: string;
    img?: string;
  }): MetaFunction =>
    () => {
      const title = `${pageTitle} | CrowdInvestInMe`;
      return {
        title,
        description,
        "og:title": title,
        "og:description": description,
        "og:type": "website",
        "twitter:card": "summary",
        "twitter:creator": "@dvargas92495",
        "twitter:title": title,
        "twitter:description": description,
        "og:image": img,
        "twitter:image": img,
      };
    };

export default Layout;
