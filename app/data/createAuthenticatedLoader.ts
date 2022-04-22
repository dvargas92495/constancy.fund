import type { LoaderFunction } from "@remix-run/server-runtime";

const createAuthenticatedLoader =
  (
    callback: (
      userId: string,
      params: Record<string, string>
    ) => Promise<unknown>
  ): LoaderFunction =>
  async ({ request, params }) => {
    return import("@clerk/remix/ssr.server.js")
      .then((clerk) => clerk.getAuth(request))
      .then(async ({ userId }) => {
        if (!userId) {
          return new Response("No valid user found", { status: 401 });
        }
        const searchParams = Object.fromEntries(
          new URL(request.url).searchParams
        );
        return callback(userId, {
          ...Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, v || ""])
          ),
          ...searchParams,
        });
      });
  };

export default createAuthenticatedLoader;
