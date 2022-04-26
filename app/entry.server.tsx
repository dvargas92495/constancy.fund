import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { ServerStyleSheet } from "styled-components";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: Parameters<typeof RemixServer>[0]["context"]
) {
  const sheet = new ServerStyleSheet();
  const markup = renderToString(
    sheet.collectStyles(
      <RemixServer context={remixContext} url={request.url} />
    )
  );

  // Inject Styled Components
  const styleTags = sheet.getStyleTags();
  const finalMarkup = markup.replace("__STYLES__", styleTags);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + finalMarkup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
