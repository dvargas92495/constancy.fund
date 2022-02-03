import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import {InternalServorError} from "aws-sdk-plus/dist/errors";
import fs from "fs";
import path from "path";
import { FE_PUBLIC_DIR } from "fuegojs/dist/common";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

const doesContractExist =
  process.env.NODE_ENV === "development"
    ? (uuid: string) =>
        Promise.resolve(
          fs.existsSync(path.join(FE_PUBLIC_DIR, `_contracts/${uuid}/draft.pdf`))
        )
    : (uuid: string) =>
        s3
          .headObject({
            Bucket: (process.env.HOST || "").replace(/^https?:\/\//, ""),
            Key: `_contracts/${uuid}/draft.pdf`,
          })
          .promise()
          .then(() => true)
          .catch(() => false);

export const waitForContract = (uuid: string, trial = 0): Promise<boolean> =>
  doesContractExist(uuid).then((exists) => {
    if (exists) {
      return true;
    } else if (trial < 100) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(waitForContract(uuid, trial + 1)), 100)
      );
    } else {
      return Promise.reject(false);
    }
  });

const logic = ({ uuid }: { uuid: string }) =>
  waitForContract(uuid).then((success) => {
    if (success) {
      return {
        success,
      };
    } else {
      throw new InternalServorError(
        `Timed out waiting for contract ${uuid} to finish generating`
      );
    }
  });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
