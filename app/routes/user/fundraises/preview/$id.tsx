import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import CheckBox from "@mui/material/Checkbox";
import type { Handler as ContractRefreshHandler } from "../../../../../functions/contract-refresh/put";
import type { Handler as GetRefreshHandler } from "../../../../../functions/contract-refresh/get";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import pdfViewerCore from "@react-pdf-viewer/core/lib/styles/index.css";
import pdfViewerLayout from "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  LinksFunction,
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from "remix";
import formatAmount from "../../../../../db/util/formatAmount";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { SecondaryAction } from "~/_common/SecondaryAction";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import SectionTitle from "~/_common/SectionTitle";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
import cookie from "cookie";
import axios from "axios";
import type { Handler as GetContractHandler } from "../../../../../functions/contract/get";

const ExplainTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.palette.color.primary};
`;

const ExplainContent = styled.div`
  grid-gap: 5px;
  display: flex;
  flex-direction: column;
`;

const ExplainText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.palette.color.tertiary};
`;

const ExplainMeLikeIamFiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  padding: 20px;
  grid-gap: 30px;
`;

const ExplainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  grid-gap: 10px;
  margin-bottom: 40px;

  & > div {
    width: fill-available;
  }
`;

const EversignEmbedContainer = styled.div`
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 8px;
  overflow: hidden;
  height: 600px;

  & > div {
    margin-bottom: 0px;

    & > div {
      border: none;

      & > div {
        border: none;
      }
    }
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

const Container = styled.div`
  max-width: 1000px;
`;

type FundraiseData = Awaited<ReturnType<GetContractHandler>>;

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieObj = cookie.parse(cookieHeader);
  const token = cookieObj.__session;
  return axios
    .get<FundraiseData>(`${process.env.API_URL}/contract?uuid=${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((r) => r.data)
    .catch((e) => {
      console.error(e);
      return {};
    });
};

const UserFundraisePreview = () => {
  const { id = "" } = useParams();
  const data = useLoaderData<FundraiseData>();
  const paymentAmount = Number(data.details.amount || 0);
  const frequency = Number(data.details.frequency || 1);
  const threshold = Number(data.details.threshold || 0);
  const totalAmount = paymentAmount * frequency;
  const navigate = useNavigate();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const refreshPreview = useAuthenticatedHandler<ContractRefreshHandler>({
    method: "PUT",
    path: "contract-refresh",
  });
  const getRefresh = useAuthenticatedHandler<GetRefreshHandler>({
    method: "GET",
    path: "contract-refresh",
  });
  const [loading, setLoading] = useState(true);
  const onRefresh = useCallback(() => {
    setLoading(true);
    refreshPreview({ uuid: id }).then(() => setLoading(false));
  }, [setLoading, id, refreshPreview]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.metaKey && e.altKey && e.key === "R") {
        onRefresh();
      }
    };
    getRefresh({ uuid: id }).then(() => setLoading(false));
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [onRefresh, getRefresh, id, setLoading]);
  return (
    <Container>
      <TopBar>
        <InfoArea>
          <PageTitle>Preview Contract {"&"} Confirm Terms</PageTitle>
          <PrimaryAction
            onClick={() =>
              navigate(`/user/fundraises/contract/${id}`, {
                state: { isOpen: true },
              })
            }
            label={"Confirm Terms"}
          />
        </InfoArea>
      </TopBar>
      <ContentContainer>
        <Section>
          <SectionTitle>Confirm Key Agreements</SectionTitle>
          <InfoText>
            We summarised the key points of the below contract for you to
            confirm.
            <br />
            It is strongly advised to still read the contract in full.
          </InfoText>
          <SubSectionTitle>Agreements</SubSectionTitle>
          <ExplainContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>How much you raise</ExplainTitle>
                <ExplainText>
                  I agree to request a total of{" "}
                  <b>${formatAmount(totalAmount)}</b> paid out as a monthly
                  stipend of ${formatAmount(paymentAmount)} per month for{" "}
                  {frequency} months.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>How much you pay back</ExplainTitle>
                <ExplainText>
                  I agree to pay back a maximum total of $
                  {formatAmount(
                    (totalAmount * Number(data.details.return)) / 100
                  )}{" "}
                  to my investors
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>What you pay back</ExplainTitle>
                <ExplainText>
                  I agree to take {formatAmount(data.details.share)}% of all my
                  revenue once I hit ${formatAmount(threshold / 12)} per month
                  or ${formatAmount(threshold)} per year in the next{" "}
                  {Number(data.details.cap || 0)} years in order to pay back my
                  investors. Includes revenue from preexisting assets.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>How you inform</ExplainTitle>
                <ExplainText>
                  I agree to update my investors on a monthly basis about my
                  income and to provide my tax returns yearly.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>How to pay back</ExplainTitle>
                <ExplainText>
                  I agree to start paying back my investors latest 3 months
                  after I hit my revenue treshold.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>

            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>When you pay back</ExplainTitle>
                <ExplainText>
                  I acknowledge that I only have to pay my investors when I
                  reach ${formatAmount(threshold / 12)}/year or on average $
                  {formatAmount(threshold)}/month. My dividends are then paid
                  from my total income, including from pre-existing assets.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
          </ExplainContainer>

          <ExplainContainer>
            <SubSectionTitle margin={"10px 0 5px 0"}>
              Acknowledgements
            </SubSectionTitle>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>Getting out early</ExplainTitle>
                <ExplainText>
                  I am aware that I can stop accepting monthly contributions of
                  investors anytime and do not have to pay dividends on not paid
                  contributions.
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
            <ExplainMeLikeIamFiveContainer>
              <ExplainContent>
                <ExplainTitle>Reading the full legal agreement</ExplainTitle>
                <ExplainText>
                  I acknowledge that the above checkboxes are summaries of key
                  terms and I have read the full legal agreement below (and if
                  not are still liable according to its terms){" "}
                </ExplainText>
              </ExplainContent>
              <CheckBox />
            </ExplainMeLikeIamFiveContainer>
          </ExplainContainer>
        </Section>
        <Section>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SectionTitle>Full Legal Agreement</SectionTitle>
            {process.env.NODE_ENV === "development" && (
              <SecondaryAction
                onClick={() => {
                  setLoading(true);
                  refreshPreview({ uuid: id }).then(() => setLoading(false));
                }}
                label={"Refresh PDF Preview"}
                height={"40px"}
              />
            )}
          </Box>
          <SubSectionTitle></SubSectionTitle>
          <EversignEmbedContainer>
            {loading ? (
              <LoadingBox>
                <LoadingIndicator />
              </LoadingBox>
            ) : (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`/_contracts/${id}/draft.pdf`}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            )}
          </EversignEmbedContainer>
        </Section>
      </ContentContainer>
    </Container>
  );
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: pdfViewerCore },
    { rel: "stylesheet", href: pdfViewerLayout },
  ];
};

export default UserFundraisePreview;
