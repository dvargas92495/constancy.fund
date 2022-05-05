import fs from "fs";
import path from "path";
import { FE_PUBLIC_DIR } from "fuegojs/dist/common";
import type { S3 } from "aws-sdk";

const doesContractExist =
  process.env.NODE_ENV === "development"
    ? (uuid: string) =>
        new Promise<boolean>((resolve) =>
          fs.stat(
            path.join(FE_PUBLIC_DIR, `_contracts/${uuid}/draft.pdf`),
            (err) => {
              if (err) resolve(false);
              else resolve(true);
            }
          )
        )
    : (uuid: string) =>
        Promise.resolve(require("aws-sdk"))
          .then((AWS) => new AWS.S3() as S3)
          .then((s3) =>
            s3
              .headObject({
                Bucket: (process.env.ORIGIN || "").replace(/^https?:\/\//, ""),
                Key: `_contracts/${uuid}/draft.pdf`,
              })
              .promise()
          )
          .then(() => true)
          .catch(() => false);

const waitForContract = (uuid: string, trial = 0): Promise<boolean> =>
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

export default waitForContract;
