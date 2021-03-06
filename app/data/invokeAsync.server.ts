import type { Lambda } from "aws-sdk";

const invokeAsync =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        Promise.resolve(require("aws-sdk"))
          .then(
            (AWS) =>
              new AWS.Lambda({ region: process.env.AWS_REGION }) as Lambda
          )
          .then((lambda) =>
            lambda
              .invoke({
                FunctionName: `${(process.env.ORIGIN || "")
                  ?.replace(/\./g, "-")
                  .replace(/^https?:\/\//, "")}_${path}`,
                InvocationType: "Event",
                Payload: JSON.stringify(data),
              })
              .promise()
          )
          .then(() => true)
    : <T extends Record<string, unknown>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        import("axios")
          .then((axios) =>
            axios.default.post(`${process.env.API_URL}/${path}`, data)
          )
          .then(() => true);

export default invokeAsync;
