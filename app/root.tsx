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

export const meta: MetaFunction = () => {
  return { title: "CrowdInvestInMe" };
};

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
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
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
