import getMeta from "~/_common/getMeta";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import signAgreement from "~/data/signAgreement.server";
import eversign from "../external/eversign";

import Icon from "~/_common/Icon";
import styled from "styled-components";
import Section from "~/_common/Section";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
import {
  ActionFunction,
  LoaderFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from "remix";
import getContract from "../data/getContract.server";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { ethers } from "ethers";
import contractJson from "../../artifacts/contracts/ISA.sol/ISA.json";

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin: auto;
  background: ${(props) => props.theme.palette.color.backgroundColorDarker};
`;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

const TopBarProfile = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  top: 0;
  background: white;
  z-index: 10;
`;

const TermSheetTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  padding-top: 130px;
  grid-gap: 15px;
`;

const BackButton = styled.div`
  display: flex;
  grid-gap: 5px;
  width: fit-content;
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 6px 12px;
  z-index: 1001;
  align-items: center;
  cursor: pointer;
`;

const ProfileTitle = styled.div<{ scroll?: number }>`
  color: ${(props) => props.theme.palette.color.darkerText};
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EversignEmbedContainer = styled.div`
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  overflow: hidden;

  & > div {
    margin-bottom: 0px;
  }

  & iframe {
    border: none;
  }
`;

const LoadingBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CONTAINER_ID = "eversign-embed";
const EversignBox = styled.div`
  height: 60vh;
  marginbottom: 32px;
`;

const EversignEmbed = ({
  url,
  onSign,
}: {
  url: string;
  onSign: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (url) {
      setLoading(false);
      eversign.open({
        url,
        containerID: CONTAINER_ID,
        width: "100%",
        height: "100%",
        events: {
          signed: onSign,
          error: (a) => {
            console.log("error", a);
          },
        },
      });
    }
  }, [url, setLoading]);
  return (
    <EversignBox id={CONTAINER_ID}>
      {loading && (
        <LoadingBox>
          <LoadingIndicator />
        </LoadingBox>
      )}
    </EversignBox>
  );
};

type Data = Awaited<ReturnType<typeof getContract>>;

const ContractPage = (): React.ReactElement => {
  const { contractUuid, userId, url, agreementUuid } = useLoaderData<Data>();
  const isInvestor = Number(useParams().signer) === 1;
  const [signed, setSigned] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        window.ethereum
      );
      const signer = provider.getSigner();
      const contract = new ethers.ContractFactory(
        contractJson.abi,
        contractJson.bytecode,
        signer
      );
      contract
        .deploy(
          fetcher.data.ethereum.investorAddress,
          fetcher.data.ethereum.share,
          fetcher.data.ethereum.cap,
          fetcher.data.ethereum.threshold,
          fetcher.data.ethereum.hash
        )
        .then((c) => {
          c.address;
          setSigned(true);
          setSnackbarOpen(true);
        });
    } else if (fetcher.data?.success) {
      setSigned(true);
      setSnackbarOpen(true);
    }
  }, [fetcher.data]);
  return (
    <ProfileContainer>
      <BackButton
        onClick={() =>
          window.location.assign(
            `/creator/${userId}?agreement=${agreementUuid}`
          )
        }
      >
        <Icon heightAndWidth={"20px"} name={"backArrow"} />
        Go Back
      </BackButton>
      <TopBarProfile>
        <TermSheetTitleBox>
          <ProfileTitle>Sign the agreement</ProfileTitle>
        </TermSheetTitleBox>
      </TopBarProfile>
      <ProfileBottomContainer paddingTop={"20px"}>
        <Section>
          <EversignEmbedContainer>
            <EversignEmbed
              url={url}
              onSign={() => {
                fetcher.submit({ agreementUuid }, { method: "put" });
              }}
            />
          </EversignEmbedContainer>
        </Section>
        {signed && !isInvestor && (
          <PrimaryAction
            onClick={() =>
              window.location.assign(
                `/user/fundraises/contract/${contractUuid}`
              )
            }
            label={"Back to Dashboard"}
          />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={() => setSnackbarOpen(false)}
          color="success"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {isInvestor
              ? "We are waiting for the creator to confirm this investment and send you an email with next steps when this happened."
              : "Congratulations! Both you and the investor have both signed the agreement! Now go create something awesome"}
          </Alert>
        </Snackbar>
      </ProfileBottomContainer>
    </ProfileContainer>
  );
};

export const loader: LoaderFunction = ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  return getContract({
    uuid: searchParams.get("uuid") || "",
    signer: searchParams.get("signer") || "",
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const agreementUuid = formData.get("agreementUuid");
  if (!agreementUuid)
    return new Response("`agreementUuid` is required", { status: 400 });
  if (typeof agreementUuid !== "string")
    return new Response("`agreementUuid` must be a string", { status: 400 });
  return signAgreement({ agreementUuid });
};

export const meta = getMeta({
  title: "Contract",
});

export default ContractPage;
