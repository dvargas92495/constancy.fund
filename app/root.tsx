import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  useCatch,
  // ScrollRestoration,
  useLoaderData,
} from "remix";
import { ExternalScripts } from "remix-utils";
import { ClerkProvider } from "@clerk/remix";
import { rootAuthLoader, WithClerkState } from "@clerk/remix/ssr.server";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import getEmotionCache, { emotionCache } from "./_common/getEmotionCache";
import { CacheProvider } from "@emotion/react";
import MuiThemeProvider from "@dvargas92495/ui/dist/components/ThemeProvider";

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
      tertiary: "#96A0B5",
    },
    // All custom fields
    color: {
      grey: "#e0e0e0",
      purple: "#347AE2",
      white: "#fff",
      lightgrey: "#f0f0f0",
      darkgrey: "#545454",
      black: "#000",
      warning: "#ff9090",
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
      backgroundColorDarkerDarker: "#E5F0FF",
      darkerBlue: "#5E6278",
      blue: "2563EB",
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    title: {
      fontSize: "30px",
      fontWeight: 800,
    },
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

const GlobalStyle = createGlobalStyle<{ theme: typeof themeProps }>`
  * {
      font-family: "Inter" !important;
    } 

    html { font-family: "Inter", "system-ui" !important; }

    html, body { height: 100%; }

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
        color: ${(props) => props.theme.palette.color.darkerText};

        &:hover {
          background: ${(props) =>
            props.theme.palette.color.backgroundColorDarker} !important;
        }
    }

    & .Mui-selected {
        background: ${(props) =>
          props.theme.palette.color.backgroundHighlight} !important;
    }

    & .Mui-focusVisible {
        background: ${(props) =>
          props.theme.palette.color.backgroundColorDarker} !important;
    }
`;

export const meta: MetaFunction = () => {
  return {
    title: "Constancy",
    "og:type": "website",
    "twitter:card": "summary",
    "twitter:creator": "@dvargas92495",
  };
};

export const loader: LoaderFunction = (args) =>
  rootAuthLoader(
    args,
    () => ({
      ENV: {
        API_URL: process.env.API_URL,
        CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API,
        NODE_ENV: process.env.NODE_ENV,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      },
    }),
    { loadUser: true }
  );

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    },
  ];
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

const RootContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: fit-content;
`;

export default function App() {
  const { data, clerkState } =
    useLoaderData<WithClerkState<{ ENV: Record<string, string> }>>();
  return (
    <ClerkProvider
      frontendApi={data?.ENV?.CLERK_FRONTEND_API}
      clerkState={clerkState}
    >
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
          {typeof document === "undefined" ? "__STYLES__" : null}
          {typeof document === "undefined" ? "__STYLES2__" : null}
        </head>
        <body>
          <ThemeProvider theme={themeProps}>
            <GlobalStyle />
            <CacheProvider
              value={
                typeof document === "undefined"
                  ? emotionCache
                  : getEmotionCache()
              }
            >
              <MuiThemeProvider {...themeProps}>
                <RootContainer id="root">
                  <Outlet />
                </RootContainer>
              </MuiThemeProvider>
            </CacheProvider>
          </ThemeProvider>
          {/* blocked on https://github.com/remix-run/remix/pull/936
        <ScrollRestoration />
        */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.process = {
  env: ${JSON.stringify(data?.ENV || {})}
};`,
            }}
          />
          <Scripts />
          <ExternalScripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    </ClerkProvider>
  );
}
