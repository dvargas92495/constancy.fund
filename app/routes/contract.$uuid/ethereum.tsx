import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import getEthereumContractData, {
  DeployedData,
  ReadyData,
} from "~/data/getEthereumContractData.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { ethers } from "ethers";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import saveDeployedSmartContract from "~/data/saveDeployedSmartContract.server";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import { infuraEthersProvidersById } from "~/enums/web3Networks";
import DefaultCatchBoundary from "~/_common/DefaultCatchBoundary";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider & ethers.providers.BaseProvider;
  }
}

const ContractContainer = styled.div`
  padding: 32px;
`;

const ViewSmartContract = (
  props: Omit<DeployedData, "valid" | "deployed"> & { isInvestor: boolean }
) => {
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then(() => {
        const signer = provider.getSigner();
        return signer.getAddress();
      })
      .then((address) => {
        setWalletAddress(address.toLowerCase());
        window.ethereum.on("accountsChanged", (s: string[]) =>
          setWalletAddress(s[0].toLowerCase())
        );
      });
  }, [setWalletAddress]);
  const [loading, setLoading] = useState(false);
  const creatorWithdraw = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      props.address,
      props.abi,
      provider.getSigner()
    );
    return contract
      .creatorWithdraw()
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .then(() => setLoading(false));
  }, [setLoading, props.address, props.abi]);
  const investorWithdraw = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      props.address,
      props.abi,
      provider.getSigner()
    );
    return contract
      .investorWithdraw()
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .then(() => setLoading(false));
  }, [setLoading, props.address, props.abi]);
  const defaultInvestment = (props.amount / props.price).toFixed(6);
  const [investment, setInvestment] = useState(defaultInvestment);
  const invest = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      props.address,
      props.abi,
      provider.getSigner()
    );
    return contract
      .invest({ value: ethers.utils.parseEther(investment) })
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .then(() => setLoading(false));
  }, [setLoading, props.address, props.abi]);
  const Summary = useCallback(
    () => (
      <>
        <p>Value stored in contract:</p>
        <ul>
          <li>
            <b>Total Balance: </b>
            {props.totalBalance} ETH
          </li>
          <li>
            <b>Creator Cut: </b>
            {(
              Number(props.balance) -
              Number(props.investorCut) +
              Number(props.revenueAllocated) +
              Number(props.investmentAllocated)
            ).toFixed(6)}{" "}
            ETH
          </li>
          <li>
            <b>Investor Cut: </b>
            {(
              Number(props.investorCut) + Number(props.returnAllocated)
            ).toFixed(6)}{" "}
            ETH
          </li>
        </ul>
        <p>Contract History:</p>
        <ul>
          <li>
            <b>Total Invested: </b>
            {props.totalInvested} ETH
          </li>
          <li>
            <b>Total Return: </b>
            {props.totalReturned} ETH
          </li>
          <li>
            <b>Total Revenue: </b>
            {props.totalRevenue} ETH
          </li>
        </ul>
      </>
    ),
    [props]
  );
  return (
    <p>
      Smart contract for this agreement is deployed on the
      {infuraEthersProvidersById[props.network]} network. View on{" "}
      <a
        target={"_blank"}
        rel={"noreferrer"}
        href={`https://${
          infuraEthersProvidersById[props.network] === "homestead"
            ? ""
            : `${infuraEthersProvidersById[props.network]}.`
        }etherscan.io/address/${props.address}`}
      >
        Etherscan
      </a>
      .
      {!walletAddress ? (
        <p>Waiting for a wallet to connect...</p>
      ) : props.isInvestor ? (
        walletAddress !== props.investorAddress ? (
          <p>
            Incorrect wallet address logged in to view this contract as
            investor. Please switch to address {props.investorAddress}
          </p>
        ) : (
          <>
            <p>Enter investment amount and click the button to invest below:</p>
            <TextFieldBox>
              <TextFieldDescription required>
                Investment ({props.totalInvested} ETH invested so far)
              </TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <TextInputOneLine
                  name={"investment"}
                  required
                  defaultValue={defaultInvestment}
                  onChange={(e) => setInvestment(e.target.value)}
                />{" "}
                ETH
              </TextInputContainer>
            </TextFieldBox>
            <PrimaryAction
              onClick={invest}
              label={"Invest"}
              isLoading={loading}
            />
            <p>Click the button below to withdraw your funds so far:</p>
            <PrimaryAction
              onClick={investorWithdraw}
              label={"Withdraw"}
              isLoading={loading}
            />
            <Summary />
          </>
        )
      ) : walletAddress !== props.creatorAddress ? (
        <p>
          Incorrect wallet address logged in to view this contract as creator.
          Please switch to address {props.creatorAddress}
        </p>
      ) : (
        <>
          <p>Click the button below to withdraw your funds so far:</p>
          <PrimaryAction
            onClick={creatorWithdraw}
            label={"Withdraw"}
            isLoading={loading}
          />
          <p>
            Make sure all users and clients send revenue for your project to
            address: {props.address}
          </p>
          <Summary />
        </>
      )}
    </p>
  );
};

const DeploySmartContract = ({
  isInvestor,
  creatorAddress,
  investorAddress,
  share,
  returnMultiple,
  threshold,
  hash,
  abi,
  bytecode,
  price,
  versionHash,
  hashAsAddress,
}: Omit<ReadyData, "valid" | "deployed"> & { isInvestor: boolean }) => {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const onDeploy = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.ContractFactory(abi, bytecode, signer);
    Promise.all([
      contract
        .deploy(
          investorAddress,
          Number(share) * 100,
          Number(returnMultiple) * 100,
          ethers.utils.parseEther((Number(threshold) / price).toFixed(6)),
          hashAsAddress
        )
        .then((contract) => {
          return contract.deployTransaction.wait().then(() => contract);
        }),
      provider.getNetwork(),
    ]).then(([contract, chain]) => {
      fetcher.submit(
        {
          address: contract.address,
          network: `${chain.chainId}`,
          hash: versionHash,
        },
        { method: "post" }
      );
    });
  }, [
    fetcher,
    abi,
    bytecode,
    hash,
    threshold,
    returnMultiple,
    share,
    investorAddress,
    hashAsAddress,
  ]);
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then(() => {
        const signer = provider.getSigner();
        return signer.getAddress();
      })
      .then((address) => {
        setWalletAddress(address.toLowerCase());
        window.ethereum.on("accountsChanged", (s: string[]) =>
          setWalletAddress(s[0].toLowerCase())
        );
      });
  }, [setWalletAddress]);
  useEffect(() => {
    console.log(fetcher.type, fetcher.state);
  }, [fetcher, setLoading]);
  return (
    <>
      <p>Agreement ready for smart contract ready deployment</p>
      {isInvestor && (
        <p>
          You need to wait for the user at address {creatorAddress} to deploy
          the smart contract.
        </p>
      )}
      {!isInvestor &&
        (!walletAddress ? (
          <p>Waiting for a wallet to connect...</p>
        ) : walletAddress !== creatorAddress ? (
          <p>
            Incorrect wallet address logged in to deploy this contract. Please
            switch to address {creatorAddress}
          </p>
        ) : (
          <>
            <p>
              Click the button below to deploy a smart contract with parameters:
            </p>
            <ul>
              <li>
                <b>Investor Address: </b>
                {investorAddress}
              </li>
              <li>
                <b>Revenue Share: </b>
                {Number(share).toFixed(2)}%
              </li>
              <li>
                <b>Return Multiple: </b>
                {Number(returnMultiple).toFixed(2)}%
              </li>
              <li>
                <b>Threshold: </b>${threshold} (
                {(Number(threshold) / price).toFixed(6)} ETH)
              </li>
              <li>
                <b>IPFS Hash: </b>
                {hash}
              </li>
            </ul>
            <PrimaryAction
              label={"Deploy Smart Contract"}
              onClick={onDeploy}
              isLoading={loading}
            />
          </>
        ))}
    </>
  );
};

const EthereumContractPage = () => {
  const loaderData = useLoaderData<
    Awaited<ReturnType<typeof getEthereumContractData>> & {
      isInvestor: boolean;
    }
  >();
  return (
    <ContractContainer>
      {!loaderData.valid && (
        <p>
          One party in this agreement does not have an ethereum address listed
          in their payment preferences, and therefore is an invalid candidate to
          deploy a smart contract.
        </p>
      )}
      {loaderData.valid && loaderData.deployed && (
        <ViewSmartContract {...loaderData} />
      )}
      {loaderData.valid && !loaderData.deployed && (
        <DeploySmartContract {...loaderData} />
      )}
    </ContractContainer>
  );
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export const loader: LoaderFunction = async ({ params, request }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  const uuid = params["uuid"] || "";
  return getEthereumContractData({ uuid })
    .then((r) => ({
      ...r,
      isInvestor: !userId,
    }))
    .catch((e: Error) => {
      throw new Response(`Failed to grab ETH contract Data: ${e.stack}`);
    });
};

export const action: ActionFunction = async ({ params, request }) => {
  if (request.method === "POST") {
    const body = await request.formData();
    const agreementUuid = params["uuid"] || "";
    return saveDeployedSmartContract({
      agreementUuid,
      address: body.get("address") as string,
      network: Number(body.get("network")),
      hash: body.get("hash") as string,
    });
  }
  throw new Response(`Unsupported method ${request.method}`, { status: 404 });
};

export const handle = {
  title: "Ethereum Smart Contracts",
};

export default EthereumContractPage;
