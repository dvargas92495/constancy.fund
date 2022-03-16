import { createRequestHandler } from "remix-lambda-at-edge";
import type { CloudFrontRequestHandler } from "aws-lambda";
// import * as build from "@remix-run/dev/server-build";
// record 11083271
// record 10920357
// import sendEmail from "aws-sdk-plus/dist/sendEmail";
console.log('Loading handler...');
const originPaths = [
  "favicon.ico",
  /^\/build\/.*/,
  /^\/images\/.*/,
  /^\/svgs\/.*/,
  /^\/_contracts\/.*/,
];

const requestHandler = createRequestHandler({
  build: require("./build"),
  originPaths,
  onError: (e) => console.log("Send email to me", e),
  /*sendEmail({
    to: "support@constancy.fund",
    subject: "Remix Origin Error",
    body: e.message,
  }),*/
});
console.log('Handler Loaded...');

export const handler: CloudFrontRequestHandler = (e, c, cb) => {
  console.log('HANDLING', e.Records[0].cf.request.uri, e.Records[0].cf.request.method)
  return requestHandler(e, c, cb);
}
