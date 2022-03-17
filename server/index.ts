import { createRequestHandler } from "remix-lambda-at-edge";
import type { CloudFrontRequestHandler } from "aws-lambda";

const originPaths = [
  "favicon.ico",
  /^\/build\/.*/,
  /^\/images\/.*/,
  /^\/svgs\/.*/,
  /^\/_contracts\/.*/,
];

const requestHandler = createRequestHandler({
  getBuild: () => require("./build"),
  originPaths,
  debug: !process.env.IS_PRODUCTION,
  onError: (e) => console.log("Send email to me", e),
  /*sendEmail({
    to: "support@constancy.fund",
    subject: "Remix Origin Error",
    body: e.message,
  }),*/
});

export const handler: CloudFrontRequestHandler = (e, c, cb) => {
  return requestHandler(e, c, cb);
}
