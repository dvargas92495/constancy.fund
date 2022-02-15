import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { generateCss } from "@dvargas92495/ui/dist/components/FuegoRoot";
import { ServerStyleSheet } from "styled-components";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  console.log("entered request");
  const sheet = new ServerStyleSheet();
  const markup = renderToString(
    sheet.collectStyles(
      <RemixServer context={remixContext} url={request.url} />
    )
  );
  console.log("created markup");
  const styleTags = sheet.getStyleTags();
  const finalMarkup = generateCss(markup.replace("__STYLES2__", styleTags));

  responseHeaders.set("Content-Type", "text/html");
  console.log("headers set");

  return new Response("<!DOCTYPE html>" + finalMarkup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
