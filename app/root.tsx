import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  // ScrollRestoration,
  useLoaderData,
} from "remix";
import { ExternalScripts } from "remix-utils";
import type { MetaFunction } from "remix";
import { createGlobalStyle } from "styled-components";
import { themeProps } from "./_common/Layout"

export const meta: MetaFunction = () => {
  return { title: "CrowdInvestInMe" };
};

const GlobalStyle = createGlobalStyle`

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
        color: ${themeProps.palette.color.darkerText};

        &:hover {
          background: ${themeProps.palette.color.backgroundColorDarker} !important;
        }
      }
    }

    & .Mui-selected {
        background: ${themeProps.palette.color.backgroundHighlight} !important;
      }
    }

    & .Mui-focusVisible {
        background: ${themeProps.palette.color.backgroundColorDarker} !important;
      }
    }
`

export function loader() {
  return {
    ENV: {
      API_URL: process.env.API_URL,
      CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API,
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  };
}

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GlobalStyle />
        <Outlet />
        {/* blocked on https://github.com/remix-run/remix/pull/936
        <ScrollRestoration />
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = {
              env: ${JSON.stringify(data.ENV)}
              };`,
          }}
        />
        <Scripts />
        <ExternalScripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
