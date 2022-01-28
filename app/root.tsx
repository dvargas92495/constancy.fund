import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { ExternalScripts } from "remix-utils";
import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
  return { title: "CrowdInvestInMe" };
};

const ENVS = ["API_URL", "CLERK_FRONTEND_API", "STRIPE_PUBLIC_KEY"];

export function loader() {
  return {
    ENV: Object.fromEntries(ENVS.map((s) => [s, process.env[s]])),
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
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
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
