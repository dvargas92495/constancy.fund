import { createRequestHandler } from "@dvargas92495/remix-lambda-at-edge";
import { CloudFrontRequestHandler } from "aws-lambda";
// import * as build from "@remix-run/dev/server-build";
// import sendEmail from "aws-sdk-plus/dist/sendEmail";

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

export const handler: CloudFrontRequestHandler = (e, c, cb) => {
  // TODO: Remove this block when clientUat bug is resolved
  console.log('Entered request handler');
  const cloudfrontRequest = e.Records[0].cf.request;
  const originPathRegexes = originPaths.map((s) =>
    typeof s === "string" ? new RegExp(s) : s
  );
  if (originPathRegexes.some((r) => r.test(cloudfrontRequest.uri))) {
    return cb(undefined, cloudfrontRequest);
  }
  if (cloudfrontRequest.headers.cookie?.[0]?.value) {
    cloudfrontRequest.headers.cookie[0].value =
      cloudfrontRequest.headers.cookie[0].value.replace("__client_uat=0; ", "");
  }
  // END TODO

  console.log('Entering core handler');
  return requestHandler(e, c, cb);
};
