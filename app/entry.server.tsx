import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  console.log('entered request');
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );
  console.log('created markup');

  responseHeaders.set("Content-Type", "text/html");
  console.log('headers set');

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}
