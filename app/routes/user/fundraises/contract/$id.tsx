import React, { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import { UserButton } from "@clerk/remix";

import _H1 from "@dvargas92495/ui/components/H1";
import _H4 from "@dvargas92495/ui/components/H4";
import CONTRACT_STAGES from "../../../../../db/contract_stages";
import {
  ActionFunction,
  LoaderFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from "remix";
import formatAmount from "../../../../../db/util/formatAmount";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ContentContainer from "~/_common/ContentContainer";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import SectionCircle from "~/_common/SectionCircle";
import Spacer from "~/_common/Spacer";
import Section from "~/_common/Section";
import SectionTitle from "~/_common/SectionTitle";
import ProgressBar from "~/_common/ProgressBar";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
import { PrimaryAction } from "~/_common/PrimaryAction";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import getFundraiseData from "~/data/getFundraiseData.server";
import deleteAgreement from "~/data/deleteAgreement.server";

const ConditionsContainer = styled.div`
  display: flex;
  grid-gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ConditionsBox = styled.div`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  height: 80px;
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px 15px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  grid-gap: 10px;
  display: flex;
`;

const SmallConditionsText = styled.span`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 12px;
  font-weight: 400;
`;

const ConditionsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 0px;
`;

const ConditionsTitle = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: bold;
  font-size: 16px;
`;

const ConditionsSubTitle = styled.div`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-weight: normal;
  font-size: 12px;
`;

const ProfileBottomContainer = styled.div<{ paddingTop: string }>`
  width: 800px;
  padding-top: ${(props) => props.paddingTop};
  height: fit-content;
  padding-bottom: 100px;
`;

const UpdatePill = styled.div`
  height: 50px;
  padding: 20px;
  font-size: 18px;
  color: ${(props) => props.theme.palette.color.purple};
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 15px;
`;

const ProgressPill = styled.div`
  background-color: ${(props) => props.theme.palette.color.backgroundHighlight};
  border-radius: 50px;
  height: 50px;
  padding: 10px 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  font-weight: bold;
`;

const ProgressPillSmall = styled.div`
  background-color: ${(props) => props.theme.palette.color.backgroundHighlight};
  border-radius: 30px;
  height: 30px;
  padding: 10px 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  font-weight: normal;
`;

const ProgressPillProgress = styled.div`
  color: ${(props) => props.theme.palette.color.purple};
  font-size: 16px;
`;

const ProgressPillSeparator = styled.div`
  width: 2px;
  height: 16px;
  margin: 0 5px;
  background: ${(props) => props.theme.palette.text.tertiary}40;
`;

const ProgressPillRear = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const ProgressPillTotal = styled.div`
  color: ${(props) => props.theme.palette.color.primary};
`;

const ProgressPillHelpText = styled.div`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: 12px;
  padding-bottom: 1px;
`;

const TitleTopBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableRow = styled.tr`
  height: 80px;
  padding: 0 50px;
`;

const TableBody = styled.tbody`
  border-radius: 8px;
  font-weight: 500;

  & > tr {
    height: 80px;
  }
`;

const Table = styled.table`
  border-radius: 12px;
  overflow: hidden;
  border-spacing: 0px;
  width: 100%;
`;

const TopText = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const BottomText = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.tertiary};
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TableCell = styled.td`
  border-top: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  padding: 0 25px;
  width: fit-content;
  width: fit-content;
  max-width: 210px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: fit-content;
  padding: 5px;
`;

const StagePill = styled.div<{ color: string }>`
  height: 30px;
  width: 30px;
  min-width: 30px;
  border-radius: 50px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  grid-gap: 10px;
  color: ${(props) => props.theme.palette.color.darkerText};
  white-space: nowrap;
`;

const Link = styled.a`
  color: ${(props) => props.theme.palette.color.purple};
  font-weight: 500;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    color: ${(props) => props.theme.palette.color.backgroundDarker};
  }
`;

const TitleTopBoxSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 20px;
  margin-bottom: 20px;
`;

type FundraiseData = Awaited<ReturnType<typeof getFundraiseData>>;
type Agreements = FundraiseData["agreements"];
const STAGE_COLORS = [
  "#48cae4",
  "#0096c7",
  "#0077b6",
  "#718355",
  "#ff9090",
  "#8312DD",
];
const STAGE_ACTIONS: ((a: {
  contractUuid: string;
  uuid: string;
  onDelete: (uuid: string) => void;
}) => React.ReactElement)[] = [
  (row) => {
    const fetcher = useFetcher();
    return (
      <>
        {fetcher.state === "idle" ? (
          <>
            <IconContainer
              onClick={() => {
                fetcher.submit({ uuid: row.uuid }, { method: "delete" });
              }}
            >
              <Icon name="remove" heightAndWidth={"16px"} />
            </IconContainer>
          </>
        ) : (
          <LoadingIndicator size={30} />
        )}
      </>
    );
  },
  (row) => (
    <Link href={`/contract?uuid=${row.uuid}&signer=1`}>
      Resend invitation to Backer
    </Link>
  ),
  (row) => (
    <PrimaryAction
      textColor="white"
      bgColor="purple"
      label={"Sign Contract"}
      onClick={() => window.open(`/contract?uuid=${row.uuid}&signer=2`)}
    />
  ),
  (row) => (
    <Link href={`/_contracts/${row.contractUuid}/${row.uuid}.pdf`}>
      View Contract
    </Link>
  ),
  () => <span />,
  () => <span />,
];

const AgreementRow = (
  row: Agreements[number] & {
    contractUuid: string;
    onDelete: (uuid: string) => void;
    total: number;
  }
) => {
  const StageAction = STAGE_ACTIONS[row.status];
  const ProgressPercentage = Math.round(
    (Number(row.amount) / Number(row.total)) * 100
  );

  return (
    <TableRow>
      <TableCell>
        <StatusRow>
          <StagePill color={STAGE_COLORS[row.status]}>
            {CONTRACT_STAGES[row.status] === "CONTRACTS_SIGNED" && "🎉"}
            {CONTRACT_STAGES[row.status] === "CONFIRM_NEW_BACKER" && (
              <Icon name={"edit"} heightAndWidth="14px" color="purple" />
            )}
          </StagePill>
          {CONTRACT_STAGES[row.status].replace(/_/g, " ").toUpperCase()}
        </StatusRow>
      </TableCell>
      <TableCell>
        <TopText>{row.name}</TopText>
        <BottomText>{row.email}</BottomText>
      </TableCell>
      <TableCell>
        <TopText>${formatAmount(row.amount)}</TopText>
        <BottomText>{ProgressPercentage} %</BottomText>
      </TableCell>
      <TableCell>
        <StageAction
          uuid={row.uuid}
          contractUuid={row.contractUuid}
          onDelete={row.onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

const Container = styled.div`
  max-width: 1000px;
`;

const UserFundraisesContract = () => {
  const { id = "" } = useParams();
  const fundraiseData = useLoaderData<FundraiseData>();
  const [rows, setRows] = useState<Agreements>(fundraiseData.agreements);
  const total = useMemo(
    () =>
      Number(fundraiseData.details.amount) *
      (Number(fundraiseData.details.frequency) || 1),
    [fundraiseData]
  );
  const rowsToSign = useMemo(
    () =>
      rows.filter(
        (row) => CONTRACT_STAGES[row.status] === "CONFIRM_NEW_BACKER"
      ),
    [rows]
  );
  const rowsConfirmed = useMemo(
    () =>
      rows.filter((row) => CONTRACT_STAGES[row.status] === "CONTRACTS_SIGNED"),
    [rows]
  );
  const progress = useMemo(
    () => rowsConfirmed.reduce((p, c) => p + c.amount, 0),
    [rowsConfirmed]
  );

  const onDelete = useCallback(
    (uuid: string) => setRows(rows.filter((r) => r.uuid !== uuid)),
    [setRows, rows]
  );

  const progressPercentage = useMemo(
    () => Math.round((Number(progress) / Number(total)) * 100),
    [progress, total]
  );
  return (
    <Container>
      <TopBar>
        <InfoArea>
          <PageTitle>My Fundraise</PageTitle>
          <UpdatePill>
            {rowsToSign.length > 0 && <span>🎉 </span>}
            <span>
              <b>{rowsToSign.length}</b> New
            </span>
          </UpdatePill>
        </InfoArea>
        <UserButton />
      </TopBar>
      <ContentContainer>
        <ProfileBottomContainer paddingTop={"0"}>
          <Section>
            <TitleTopBox>
              <SectionTitle>Progress</SectionTitle>
              <ProgressPill>
                {fundraiseData.details.supportType === "monthly" && (
                  <ProgressPillProgress>
                    ${formatAmount(progress / 12)}
                  </ProgressPillProgress>
                )}
                {fundraiseData.details.supportType === "once" && (
                  <ProgressPillProgress>
                    ${formatAmount(progress)}
                  </ProgressPillProgress>
                )}
                <ProgressPillSeparator />
                <ProgressPillRear>
                  {fundraiseData.details.supportType === "monthly" && (
                    <>
                      <ProgressPillTotal>
                        {formatAmount(total / 12)}
                      </ProgressPillTotal>
                      <ProgressPillHelpText>/ month</ProgressPillHelpText>
                    </>
                  )}
                  {fundraiseData.details.supportType === "once" && (
                    <ProgressPillTotal>
                      ${formatAmount(total)}
                    </ProgressPillTotal>
                  )}
                </ProgressPillRear>
              </ProgressPill>
            </TitleTopBox>
            <Spacer height={"20px"} />
            <ProgressBar progress={progressPercentage} />
          </Section>
          <ConditionsContainer>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon
                  name={"dollar"}
                  color={"purple"}
                  heightAndWidth={"15px"}
                />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Funding Goal</ConditionsSubTitle>
                <ConditionsTitle>
                  {fundraiseData.details.supportType === "monthly" && (
                    <>
                      ${formatAmount(Math.floor(total / 12))}
                      <SmallConditionsText>/month</SmallConditionsText>
                    </>
                  )}
                  {fundraiseData.details.supportType === "once" && (
                    <>${formatAmount(Math.floor(total))}</>
                  )}
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon
                  name={"repeat"}
                  color={"purple"}
                  heightAndWidth={"15px"}
                />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Pays Back</ConditionsSubTitle>
                <ConditionsTitle>
                  $
                  {formatAmount(
                    (total * Number(fundraiseData.details.return || 0)) / 100
                  )}
                  <SmallConditionsText>
                    {" "}
                    {fundraiseData.details.return}%
                  </SmallConditionsText>
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon name={"split"} color={"purple"} heightAndWidth={"15px"} />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Shares Revenue</ConditionsSubTitle>
                <ConditionsTitle>
                  {fundraiseData.details.share || 0}%
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon
                  name={"trendingUp"}
                  color={"purple"}
                  heightAndWidth={"15px"}
                />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Revenue Threshold</ConditionsSubTitle>
                <ConditionsTitle>
                  $
                  {formatAmount(
                    Math.floor(
                      Number(fundraiseData.details.threshold || 0) / 12
                    )
                  )}
                  <SmallConditionsText>/month</SmallConditionsText>
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
          </ConditionsContainer>

          <Section>
            <TitleTopBoxSmall>
              <SectionTitle margin={"0px"}>Your Backers</SectionTitle>
              <ProgressPillSmall>
                <ProgressPillProgress>
                  Confirmed: <b>{rowsConfirmed.length}</b>
                </ProgressPillProgress>
              </ProgressPillSmall>
            </TitleTopBoxSmall>
            <Box>
              <Table>
                {/* <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {rows.map((row) => (
                    <AgreementRow
                      key={row.uuid}
                      {...row}
                      contractUuid={id}
                      onDelete={onDelete}
                      total={total}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Section>
        </ProfileBottomContainer>
      </ContentContainer>
    </Container>
  );
};

export const loader: LoaderFunction = createAuthenticatedLoader(
  (userId, params) => getFundraiseData({ uuid: params.id || "", userId })
);

export const action: ActionFunction = async ({ request }) => {
  return import("@clerk/remix/ssr.server")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        return new Response("Unauthorized", { status: 401 });
      }
      const formData = await request.formData();
      if (request.method === "DELETE") {
        const uuid = formData.get("uuid");
        if (!uuid) return new Response("`uuid` is required", { status: 400 });
        if (typeof uuid !== "string")
          return new Response("`uuid` must be a string", { status: 400 });
        return deleteAgreement({ uuid, userId });
      } else {
        return {};
      }
    });
};

export default UserFundraisesContract;
