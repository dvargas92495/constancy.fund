import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useCatch,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  ErrorBoundaryComponent,
} from "@remix-run/server-runtime";
import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import DefaultErrorBoundary from "./_common/DefaultErrorBoundary";

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
    divider: "#333333",
    common: {
      white: "#fff",
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
      normalText: "#73778B",
      backgroundColor: "#F8FBFF",
      backgroundColorDarker: "#e5f0ff70",
      backgroundColorDarkerDarker: "#E5F0FF",
      darkerBlue: "#5E6278",
      blue: "2563EB",
    },
  },
  typography: {
    fontWeightBold: 600,
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

    *, *::before, *::after {
      box-sizing: inherit;
    }

    html { 
      font-family: "Inter", "system-ui" !important;
      --webkit-font-smoothing: antialiased;
      --moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      --webkit-text-size-adjust: 100%;
    }

    html, body { height: 100%; }

    body {
      margin: 0;
      backgroundColor: ${(props) => props.theme.palette.background.default};
    }

    body::backdrop {
      backgroundColor: ${(props) => props.theme.palette.background.default};
    }

    @supports (font-variation-settings: normal) {
      html { font-family: "Inter", "system-ui" !important; }
    }

    strong, b {
      fontWeight: ${(props) => props.theme.typography.fontWeightBold};
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

export const loader: LoaderFunction = (args) => {
  return import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.rootAuthLoader(
      args,
      () => ({
        ENV: {
          API_URL: process.env.API_URL,
          CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API,
          ORIGIN: process.env.ORIGIN,
          NODE_ENV: process.env.NODE_ENV,
          STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        },
      }),
      { loadUser: true }
    )
  );
};

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

export const CatchBoundary = ClerkCatchBoundary(() => {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Caught an Error</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
});

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  // using inline-styles instead of styled components for now due to hydration issues
  return (
    <html>
      <head>
        <title>Error!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body>
        <DefaultErrorBoundary error={error} />
        <Scripts />
      </body>
    </html>
  );
};

const RootContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: fit-content;
`;

const App = () => {
  const data = useLoaderData<{ ENV: Record<string, string> }>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <ThemeProvider theme={themeProps}>
          <GlobalStyle />
          <RootContainer id="root">
            <Outlet />
          </RootContainer>
        </ThemeProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = {
  env: ${JSON.stringify(data?.ENV || {})}
};`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export default ClerkApp(App);
