import axios from "axios";
import uploadToIpfs from "./uploadToIpfs.server";
import getMysql from "./mysql.server";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import getPaymentPreferences from "./getPaymentPreferences.server";
import FUNDRAISE_TYPES from "~/enums/fundraiseTypes";
import fs from "fs";
import bs58 from "bs58";
import { providers, Contract, ContractInterface, utils, ethers } from "ethers";
import { infuraEthersProvidersById } from "~/enums/web3Networks";
import type { S3 } from "aws-sdk";

const ipfsHashToBytes32 = (s: string) =>
  `0x${Buffer.from(bs58.decode(s).slice(2)).toString("hex")}`;

const getEthPriceInUsd = () =>
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((r) => r.data.ethereum.usd as number)
    .catch((e) => {
      throw new Error(`Failed to get ETH price in USD:\n${e.response?.data || e.message}`);
    });

export type InvalidData = { valid: false; deployed: false };
export type DeployedData = {
  deployed: true;
  valid: true;
  creatorAddress: string;
  investorAddress: string;
  address: string;
  network: number;
  abi: ContractInterface;
  amount: number;
  price: number;
  totalInvested: string;
  totalRevenue: string;
  totalReturned: string;
  balance: string;
  investorCut: string;
  investmentAllocated: string;
  revenueAllocated: string;
  returnAllocated: string;
  totalBalance: string;
};
export type ReadyData = {
  valid: true;
  deployed: false;
  creatorAddress: string;
  investorAddress: string;
  share: string;
  returnMultiple: string;
  threshold: string;
  hash: string;
  hashAsAddress: string;
  abi: ContractInterface;
  bytecode: utils.BytesLike;
  price: number;
  versionHash: string;
};

const getEthereumContractData = ({ uuid }: { uuid: string }) => {
  return getMysql().then(({ execute, destroy }) => {
    return execute(
      `SELECT i.uuid as investor, c.userId, d.address, d.network, d.hash, c.uuid as contract, c.type, a.amount
        FROM agreement a
        INNER JOIN investor i ON i.uuid = a.investorUuid
        INNER JOIN contract c ON c.uuid = a.contractUuid
        LEFT JOIN deployed_smart_contracts d on d.agreement_uuid = a.uuid
        WHERE a.uuid = ?`,
      [uuid]
    )
      .then((results) => {
        const [doc] = results as {
          investor: string;
          userId: string;
          address: string | null;
          network: number | null;
          hash: string | null;
          contract: string;
          type: number;
          amount: number;
        }[];
        if (!doc)
          throw new NotFoundError(
            `Could not find data associated with agreement ${uuid}`
          );
        return Promise.all([
          getPaymentPreferences(doc.userId, execute),
          getPaymentPreferences(doc.investor, execute),
          execute(
            `SELECT d.label, d.value
             FROM contractdetail d
             WHERE d.contractUuid = ?`,
            [doc.contract]
          ),
        ]).then(
          ([
            creatorPaymentPreferences,
            investorPaymentPreferences,
            details,
          ]) => {
            return {
              ...doc,
              creatorPaymentPreferences,
              investorPaymentPreferences,
              contractDetails: Object.fromEntries(
                (details as { label: string; value: string }[]).map((d) => [
                  d.label,
                  d.value,
                ])
              ),
              type: FUNDRAISE_TYPES[doc.type].id,
            };
          }
        );
      })
      .catch((e) => {
        throw new Error(`Failed to query data from internal database: ${e}`);
      })
      .then(
        ({
          creatorPaymentPreferences,
          investorPaymentPreferences,
          contractDetails,
          address,
          network,
          contract,
          type,
          hash,
          amount,
        }): Promise<InvalidData | ReadyData | DeployedData> => {
          if (
            !creatorPaymentPreferences["ethereum"] ||
            !investorPaymentPreferences["ethereum"]
          ) {
            destroy();
            return Promise.resolve({
              valid: false,
              deployed: false,
            });
          }
          if (address && network) {
            destroy();
            const provider = new providers.InfuraProvider(
              infuraEthersProvidersById[network],
              process.env.INFURA_ID
            );
            return axios
              .get(`https://ipfs.io/ipfs/${hash}`)
              .catch((e) => {
                throw new Error(
                  `Failed to find IPFS hash ${hash}: ${e.response?.data || e}`
                );
              })
              .then((res) => {
                const contract = new Contract(address, res.data.abi, provider);
                return Promise.all([
                  contract.owner().then((s: string) => s.toLowerCase()),
                  contract.investor().then((s: string) => s.toLowerCase()),
                  Promise.resolve(res.data.abi),
                  getEthPriceInUsd(),
                  contract
                    .totalInvested()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .totalRevenue()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .totalReturned()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .balance()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .investorCut()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .investmentAllocated()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .revenueAllocated()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  contract
                    .returnAllocated()
                    .then((s: ethers.BigNumber) => utils.formatEther(s)),
                  provider
                    .getBalance(contract.address)
                    .then((s) => utils.formatEther(s))
                    .catch((e) => {
                      throw new Error(`Failed to get contract balance: ${e}`);
                    }),
                ]);
              })
              .then(
                ([
                  creatorAddress,
                  investorAddress,
                  abi,
                  price,
                  totalInvested,
                  totalRevenue,
                  totalReturned,
                  balance,
                  investorCut,
                  investmentAllocated,
                  revenueAllocated,
                  returnAllocated,
                  totalBalance,
                ]) =>
                  ({
                    valid: true,
                    deployed: true,
                    address,
                    network,
                    creatorAddress,
                    investorAddress,
                    abi,
                    amount,
                    price,
                    totalInvested,
                    totalRevenue,
                    totalReturned,
                    balance,
                    investorCut,
                    investmentAllocated,
                    revenueAllocated,
                    returnAllocated,
                    totalBalance,
                  } as const)
              )
              .catch((e) => {
                throw new Error(
                  `Error was thrown querying data from smart contract: ${e}`
                );
              });
          }
          return Promise.all([
            execute(
              `SELECT hash FROM smart_contracts WHERE contract = ? ORDER BY version DESC LIMIT 1`,
              [type]
            )
              .then((records) => records as { hash: string }[])
              .then(([{ hash }]) =>
                axios
                  .get(`https://ipfs.io/ipfs/${hash}`)
                  .then((res) => ({ ...res.data, versionHash: hash }))
              ),
            (process.env.NODE_ENV === "production"
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
            )
              .then((file) =>
                uploadToIpfs({
                  file,
                }) // TODO: Remove from GET
              )
              .catch((e) => {
                throw new Error(
                  `Failed to get contract pdf and upload to ipfs: ${e.response?.data || e}`
                );
              }),
            getEthPriceInUsd(),
          ])
            .then(([contractJson, hash, price]) => {
              destroy();
              return {
                valid: true,
                deployed: false,
                creatorAddress: (
                  creatorPaymentPreferences["ethereum"]["Address"] || ""
                ).toLowerCase(),
                investorAddress: (
                  investorPaymentPreferences["ethereum"]["Address"] || ""
                ).toLowerCase(),
                share: contractDetails.share,
                returnMultiple: contractDetails.return,
                threshold: contractDetails.threshold,
                hash,
                hashAsAddress: ipfsHashToBytes32(hash),
                versionHash: contractJson.versionHash,
                abi: contractJson.abi,
                bytecode: contractJson.bytecode,
                price,
              } as const;
            })
            .catch((e) => {
              throw new Error(
                `Failed to get ETH contract setup data: ${e.response?.data || e}`
              );
            });
        }
      );
  });
};

export default getEthereumContractData;
