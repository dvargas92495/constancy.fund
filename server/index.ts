import { createRequestHandler } from "@dvargas92495/remix-lambda-at-edge";
// import sendEmail from "aws-sdk-plus/dist/sendEmail";

export const handler = createRequestHandler({
  build: require("./build"),
  originPaths: [
    "favicon.ico",
    /^\/build\/.*/,
    /^\/payment-options\/.*/,
    /^\/_contracts\/.*/,
  ],
  onError: (e) => console.log("Send email to me", e),
  /*sendEmail({
      to: "support@crowdinvestin.me",
      subject: "Remix Origin Error",
      body: e.message,
    }),*/
});
