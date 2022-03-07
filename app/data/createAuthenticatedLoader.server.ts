import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "remix";

const createAuthenticatedLoader =
  (
    callback: (
      userId: string,
      params: Record<string, string>
    ) => Promise<unknown>
  ) =>
  async ({ request, params }: Parameters<LoaderFunction>[0]) => {
    return getAuth(request).then(async ({ userId }) => {
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
