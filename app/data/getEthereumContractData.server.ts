import axios from "axios";
import uploadToIpfs from "./uploadToIpfs.server";
import getMysql from "./mysql.server";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import getPaymentPreferences from "./getPaymentPreferences.server";
import FUNDRAISE_TYPES from "../enums/fundraiseTypes";
import fs from "fs";
import bs58 from "bs58";
import { providers, Contract, ContractInterface, utils } from "ethers";

const ipfsHashToBytes32 = (s: string) =>
  `0x${Buffer.from(bs58.decode(s).slice(2)).toString("hex")}`;

const MAINNET_NETWORK_ID = 0x1;
const KOVAN_NETWORK_ID = 0x2a;
const ROPSTEN_NETWORK_ID = 0x3;
const RINKEBY_NETWORK_ID = 0x4;
const GOERLI_NETWORK_ID = 0x5;
const OPTIMISM_NETWORK_ID = 10;
const OPTIMISM_KOVAN_NETWORK_ID = 69;
const ARBITRUM_TEST_NETWORK_ID = 421611;
const ARBITRUM_NETWORK_ID = 42161;
const POLYGON_MAIN_NETWORK_ID = 137;
const POLYGON_TEST_NETWORK_ID = 80001;
const LOCALHOST_NETWORK_ID = 0x7a69;

const infuraEthersProvidersById: {
  [id: number]: string;
} = {
  [LOCALHOST_NETWORK_ID]: "localhost",
  [KOVAN_NETWORK_ID]: "kovan",
  [ROPSTEN_NETWORK_ID]: "ropsten",
  [MAINNET_NETWORK_ID]: "homestead",
  [RINKEBY_NETWORK_ID]: "rinkeby",
  [OPTIMISM_NETWORK_ID]: "optimism",
  [OPTIMISM_KOVAN_NETWORK_ID]: "optimism-kovan",
  [POLYGON_MAIN_NETWORK_ID]: "matic",
  [POLYGON_TEST_NETWORK_ID]: "maticmum",
  [GOERLI_NETWORK_ID]: "goerli",
  [ARBITRUM_TEST_NETWORK_ID]: "arbitrum-rinkeby",
  [ARBITRUM_NETWORK_ID]: "arbitrum",
};

const getEthPriceInUsd = () =>
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((r) => r.data.ethereum.usd);

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
        }): Promise<
          | { valid: false; deployed: false }
          | {
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
              balance: string;
              investorCut: string;
            }
          | {
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
            }
        > => {
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
              .then((res) => {
                const contract = new Contract(address, res.data.abi, provider);
                return Promise.all([
                  contract.owner().then((s: string) => s.toLowerCase()),
                  contract.investor().then((s: string) => s.toLowerCase()),
                  Promise.resolve(res.data.abi),
                  getEthPriceInUsd(),
                  contract.totalInvested().then((s: number) => utils.formatEther(s)),
                  contract.balance().then((s: number) => utils.formatEther(s)),
                  contract.investorCut().then((s: number) => utils.formatEther(s)),
                ]);
              })
              .then(
                ([
                  creatorAddress,
                  investorAddress,
                  abi,
                  price,
                  totalInvested,
                  balance,
                  investorCut,
                ]) => ({
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
                  balance,
                  investorCut,
                })
              );
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
              ? import("aws-sdk")
                  .then((AWS) => new AWS.default.S3())
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
            ),
            getEthPriceInUsd(),
          ]).then(([contractJson, hash, price]) => {
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
            };
          });
        }
      );
  });
};

export default getEthereumContractData;
