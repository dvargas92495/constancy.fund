import { createRequestHandler } from "@dvargas92495/remix-lambda-at-edge";
import type { CloudFrontRequestEvent } from "aws-lambda";
// import * as build from "@remix-run/dev/server-build";
// import sendEmail from "aws-sdk-plus/dist/sendEmail";

export const handler = (e: CloudFrontRequestEvent, c, cb) => {
  const request = e.Records[0].cf.request;
  console.log("URI::", request.uri);
  console.log("METHOD::", request.method);
  console.log("HEADERS::", request.headers);
  return createRequestHandler({
    build: require("./build"),
    originPaths: [
      "favicon.ico",
      /^\/build\/.*/,
      /^\/images\/.*/,
      /^\/svgs\/.*/,
      /^\/_contracts\/.*/,
    ],
    onError: (e) => console.log("Send email to me", e),
    /*sendEmail({
      to: "support@constancy.fund",
      subject: "Remix Origin Error",
      body: e.message,
    }),*/
  })(e, c, cb);
};
