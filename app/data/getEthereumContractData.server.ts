import axios from "axios";
import getMysql from "./mysql.server";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import getPaymentPreferences from "./getPaymentPreferences.server";
import FUNDRAISE_TYPES from "~/enums/fundraiseTypes";
import {
  providers,
  Contract,
  ContractInterface,
  utils,
  ethers,
  ContractFunction,
} from "ethers";
import { infuraEthersProvidersById } from "~/enums/web3Networks";
import getEthereumAbiByFundraiseType from "./getEthereumAbiByFundraiseType.server";

const getEthPriceInUsd = () =>
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((r) => r.data.ethereum.usd as number)
    .catch((e) => {
      throw new Error(
        `Failed to get ETH price in USD:\n${e.response?.data || e.message}`
      );
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
  creatorWithdrawPreview: string;
  investorWithdrawPreview: string;
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
                  (contract.totalInvested as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.totalRevenue as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.totalReturned as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.balance as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.investorCut as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.investmentAllocated as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.revenueAllocated as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  (contract.returnAllocated as ContractFunction)().then(
                    (s: ethers.BigNumber) => utils.formatEther(s)
                  ),
                  !contract.creatorWithdrawPreview
                    ? Promise.resolve("")
                    : (
                        contract.creatorWithdrawPreview as ContractFunction
                      )().then((s: ethers.BigNumber) => utils.formatEther(s)),
                  !contract.investorWithdrawPreview
                    ? Promise.resolve("")
                    : (
                        contract.investorWithdrawPreview as ContractFunction
                      )().then((s: ethers.BigNumber) => utils.formatEther(s)),
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
                  creatorWithdrawPreview,
                  investorWithdrawPreview,
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
                    creatorWithdrawPreview:
                      creatorWithdrawPreview ||
                      (
                        Number(investmentAllocated) +
                        Number(revenueAllocated) +
                        Number(balance) -
                        Number(investorCut)
                      ).toFixed(6),
                    investorWithdrawPreview:
                      investorWithdrawPreview ||
                      (Number(returnAllocated) + Number(investorCut)).toFixed(
                        6
                      ),
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
            getEthereumAbiByFundraiseType(type, execute),
            getEthPriceInUsd(),
          ])
            .then(([contractJson, price]) => {
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
                versionHash: contractJson.versionHash,
                abi: contractJson.abi,
                bytecode: contractJson.bytecode,
                price,
              } as const;
            })
            .catch((e) => {
              throw new Error(
                `Failed to get ETH contract setup data: ${
                  e.response?.data || e
                }`
              );
            });
        }
      );
  });
};

export default getEthereumContractData;
