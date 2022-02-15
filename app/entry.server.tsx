import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { generateCss } from "@dvargas92495/ui/dist/components/FuegoRoot";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  console.log("entered request");
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );
  console.log("created markup");
  const finalMarkup = generateCss(markup);

  responseHeaders.set("Content-Type", "text/html");
  console.log("headers set");

  return new Response("<!DOCTYPE html>" + finalMarkup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
