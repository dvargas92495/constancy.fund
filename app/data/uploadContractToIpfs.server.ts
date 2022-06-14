import fs from "fs";
import bs58 from "bs58";
import type { S3 } from "aws-sdk";
import uploadToIpfs from "./uploadToIpfs.server";
import getMysql from "./mysql.server";

const ipfsHashToBytes32 = (s: string) =>
  `0x${Buffer.from(bs58.decode(s).slice(2)).toString("hex")}`;

const uploadContractToIpfs = ({ uuid }: { uuid: string }) => {
  return getMysql()
    .then(({ execute, destroy }) => {
      return execute(
        `SELECT a.contractUuid as contract,
            FROM agreement a
            WHERE a.uuid = ?`,
        [uuid]
      ).then((results) => {
        destroy();
        const [doc] = results as {
          contract: string;
        }[];
        const contract = doc?.contract;
        return (
          process.env.NODE_ENV === "production"
            ? Promise.resolve(require("aws-sdk"))
                .then((AWS) => new AWS.S3() as S3)
                .then((s3) =>
                  s3
                    .getObject({
                      Bucket: process.env.IS_PRODUCTION
                        ? "constancy.fund"
                        : "staging.constancy.fund",
                      Key: `_contracts/${contract}/${uuid}.pdf`,
                    })
                    .promise()
                    .then((data) => data.Body as Buffer)
                )
            : Promise.resolve(
                fs.readFileSync(`public/_contracts/${contract}/${uuid}.pdf`)
              )
        ).then((file) =>
          uploadToIpfs({
            file,
          })
        );
      });
    }).then((hash) => ({hash, 
        hashAsAddress: ipfsHashToBytes32(hash),}))
    .catch((e) => {
      throw new Error(
        `Failed to get contract pdf and upload to ipfs: ${
          e.response?.data || e
        }`
      );
    });
};

export default uploadContractToIpfs;
