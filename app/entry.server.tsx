import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { ServerStyleSheet } from "styled-components";
import createEmotionServer from "@emotion/server/create-instance";
import { emotionCache } from "./_common/getEmotionCache";

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

  // Inject MUI
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);
  const chunks = extractCriticalToChunks(markup);
  const styles = constructStyleTagsFromChunks(chunks);
  const postMuiMarkup = markup.replace("__STYLES__", styles);

  // Inject Styled Components
  const styleTags = sheet.getStyleTags();
  const finalMarkup = postMuiMarkup.replace("__STYLES2__", styleTags);

  responseHeaders.set("Content-Type", "text/html");
  console.log("headers set");

  return new Response("<!DOCTYPE html>" + finalMarkup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
