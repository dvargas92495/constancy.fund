import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import getEthereumContractData from "~/data/getEthereumContractData.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { ethers } from "ethers";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import saveDeployedSmartContract from "~/data/saveDeployedSmartContract.server";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider & ethers.providers.BaseProvider;
  }
}

const ContractContainer = styled.div`
  padding: 32px;
`;

const ViewSmartContract = ({
  network,
  address,
  isInvestor,
  creatorAddress,
  investorAddress,
  abi,
  amount,
  price,
  totalInvested,
  balance,
  investorCut,
}: {
  network: number;
  address: string;
  isInvestor: boolean;
  creatorAddress: string;
  investorAddress: string;
  abi: ethers.ContractInterface;
  amount: number;
  price: number;
  totalInvested: string;
  balance: string;
  investorCut: string;
}) => {
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
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    return contract.creatorWithdraw().then(() => setLoading(false));
  }, [setLoading, address, abi]);
  const investorWithdraw = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    return contract.investorWithdraw().then(() => setLoading(false));
  }, [setLoading, address, abi]);
  const defaultInvestment = (amount / price).toFixed(6);
  const [investment, setInvestment] = useState(defaultInvestment);
  const invest = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    return contract
      .invest({ value: ethers.utils.parseEther(investment) })
      .then(() => setLoading(false));
  }, [setLoading, address, abi]);
  return (
    <p>
      Smart contract for this agreement is deployed on chain ({network}) at
      address ({address}).
      {!walletAddress ? (
        <p>Waiting for a wallet to connect...</p>
      ) : isInvestor ? (
        walletAddress !== investorAddress ? (
          <p>
            Incorrect wallet address logged in to view this contract as
            investor. Please switch to address {investorAddress}
          </p>
        ) : (
          <>
            <p>Enter investment amount and click the button to invest below:</p>
            <TextFieldBox>
              <TextFieldDescription required>
                Investment ({totalInvested} ETH invested so far)
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
            <p>Value stored in contract:</p>
            <ul>
              <li>
                <b>Total Balance: </b>
                {balance} ETH
              </li>
              <li>
                <b>Creator Cut: </b>
                {(Number(balance) - Number(investorCut)).toFixed(1)} ETH
              </li>
              <li>
                <b>Investor Cut: </b>
                {investorCut} ETH
              </li>
            </ul>
          </>
        )
      ) : walletAddress !== creatorAddress ? (
        <p>
          Incorrect wallet address logged in to view this contract as creator.
          Please switch to address {creatorAddress}
        </p>
      ) : (
        <>
          <p>Click the button below to withdraw your funds so far:</p>
          <PrimaryAction
            onClick={creatorWithdraw}
            label={"Withdraw"}
            isLoading={loading}
          />
          <p>Value stored in contract:</p>
          <ul>
            <li>
              <b>Total Balance: </b>
              {balance} ETH
            </li>
            <li>
              <b>Creator Cut: </b>
              {(Number(balance) - Number(investorCut)).toFixed(1)} ETH
            </li>
            <li>
              <b>Investor Cut: </b>
              {investorCut} ETH
            </li>
          </ul>
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
}: {
  isInvestor: boolean;
  creatorAddress: string;
  investorAddress: string;
  share: string;
  returnMultiple: string;
  threshold: string;
  hash: string;
  abi: ethers.ContractInterface;
  bytecode: ethers.utils.BytesLike;
  price: number;
  versionHash: string;
  hashAsAddress: string;
}) => {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const onDeploy = useCallback(() => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.ContractFactory(abi, bytecode, signer);
    Promise.all([
      contract.deploy(
        investorAddress,
        Number(share) * 100,
        Number(returnMultiple) * 100,
        ethers.utils.parseEther((Number(threshold) / price).toFixed(6)),
        hashAsAddress
      ),
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
        <ViewSmartContract
          isInvestor={loaderData.isInvestor}
          network={loaderData.network}
          address={loaderData.address}
          creatorAddress={loaderData.creatorAddress}
          investorAddress={loaderData.investorAddress}
          abi={loaderData.abi}
          balance={loaderData.balance}
          price={loaderData.price}
          totalInvested={loaderData.totalInvested}
          investorCut={loaderData.investorCut}
          amount={loaderData.amount}
        />
      )}
      {loaderData.valid && !loaderData.deployed && (
        <DeploySmartContract
          isInvestor={loaderData.isInvestor}
          creatorAddress={loaderData.creatorAddress}
          investorAddress={loaderData.investorAddress}
          threshold={loaderData.threshold}
          returnMultiple={loaderData.returnMultiple}
          share={loaderData.share}
          hash={loaderData.hash}
          abi={loaderData.abi}
          bytecode={loaderData.bytecode as ethers.utils.BytesLike}
          price={loaderData.price}
          versionHash={loaderData.versionHash}
          hashAsAddress={loaderData.hashAsAddress}
        />
      )}
    </ContractContainer>
  );
};

export const ErrorBoundary = DefaultErrorBoundary;

export const loader: LoaderFunction = async ({ params, request }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  const uuid = params["uuid"] || "";
  return getEthereumContractData({ uuid }).then((r) => ({
    ...r,
    isInvestor: !userId,
  }));
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
