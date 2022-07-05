import React, { useState, useMemo, useRef, useEffect } from "react";
import { UserButton, useUser } from "@clerk/remix";
import CONTRACT_STAGES from "~/enums/contract_stages";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link as RemixLink,
  useFetcher,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import formatAmount from "~/util/formatAmount";
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
import { SecondaryAction } from "~/_common/SecondaryAction";
import Toast from "~/_common/Toast";
import inviteInvestor from "~/data/inviteInvestor.server";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import SuccessSnackbar from "~/_common/SuccessSnackbar";
import { useDashboardActions } from "~/_common/DashboardActionContext";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

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
  margin-right: 16px;
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

type LoaderData = Awaited<ReturnType<typeof getFundraiseData>>;
type Agreements = LoaderData["agreements"];
const STAGE_COLORS = [
  "#48cae4",
  "#0096c7",
  "#0077b6",
  "#718355",
  "#ff9090",
  "#8312DD",
];

const RowDelete = (row: {
  contractUuid: string;
  uuid: string;
}): React.ReactElement => {
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
};

const STAGE_ACTIONS: typeof RowDelete[] = [
  RowDelete,
  (row) => <Link href={`/contract/${row.uuid}`}>Visit Contract Page</Link>,
  (row) => (
    <PrimaryAction
      textColor="white"
      bgColor="purple"
      label={"Sign Contract"}
      onClick={() => window.open(`/contract/${row.uuid}`)}
    />
  ),
  (row) => (
    <Link href={`/_contracts/${row.contractUuid}/${row.uuid}.pdf`}>
      View Contract PDF
    </Link>
  ),
  () => <span />,
  () => <span />,
];

const AgreementRow = (
  row: Agreements[number] & {
    contractUuid: string;
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
          <Link href={`/contract/${row.uuid}`}>
            {CONTRACT_STAGES[row.status].replace(/_/g, " ").toUpperCase()}
          </Link>
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
        <StageAction uuid={row.uuid} contractUuid={row.contractUuid} />
      </TableCell>
    </TableRow>
  );
};

const InfoSubBar = styled.span`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  max-width: 1000px;
`;

const UserFundraisesContract = () => {
  const { id = "" } = useParams();
  const fundraiseData = useLoaderData<LoaderData>();
  const rows = useMemo<Agreements>(
    () => fundraiseData.agreements,
    [fundraiseData.agreements]
  );
  const frequency = useMemo(
    () => Number(fundraiseData.details.frequency) || 1,
    [fundraiseData]
  );
  const total = useMemo(
    () => Number(fundraiseData.details.amount) * frequency,
    [fundraiseData]
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

  const progressPercentage = useMemo(
    () => Math.round((Number(progress) / Number(total)) * 100),
    [progress, total]
  );
  const [publicLinkCopied, setPublicLinkCopied] = useState(false);
  const [hiddenLink, setHiddenLink] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setShowSecondary } = useDashboardActions();
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("copied", () =>
        setPublicLinkCopied(true)
      );
    }
    setShowSecondary(true);
  }, [containerRef, setPublicLinkCopied]);
  return (
    <Container ref={containerRef} id={"container"}>
      <Toast open={publicLinkCopied} onClose={() => setPublicLinkCopied(false)}>
        Public Link Copied!
      </Toast>
      <ContentContainer>
        <ProfileBottomContainer paddingTop={"0"}>
          <Section>
            <TitleTopBox>
              <SectionTitle onClick={() => setHiddenLink(!hiddenLink)}>
                Progress
              </SectionTitle>
              {hiddenLink && (
                <RemixLink to={`/user/fundraises?stay=true`}>
                  All Fundraises
                </RemixLink>
              )}
              <ProgressPill>
                {fundraiseData.details.supportType === "monthly" && (
                  <ProgressPillProgress>
                    ${formatAmount(progress / frequency)}
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
                        {formatAmount(total / frequency)}
                      </ProgressPillTotal>
                      <ProgressPillHelpText>
                        / month for {frequency} months
                      </ProgressPillHelpText>
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
                      ${formatAmount(Math.floor(total / frequency))}
                      <SmallConditionsText>
                        /month for {frequency} months
                      </SmallConditionsText>
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
            <div>
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
                      total={total}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          <Section>
            <TitleTopBoxSmall>
              <SectionTitle margin={"0px"}>Invite Investor</SectionTitle>
            </TitleTopBoxSmall>
            <Form method="post">
              <TextFieldBox>
                <TextFieldDescription required>Name</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine name={"name"} required />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription required>Email</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine name={"email"} required />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription required>Amount</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine name={"amount"} required />
                </TextInputContainer>
              </TextFieldBox>
              <PrimaryAction label={"Invite"} type={"submit"} />
              <SuccessSnackbar message="Successfully invited investor to fundraise!" />
            </Form>
          </Section>
        </ProfileBottomContainer>
      </ContentContainer>
    </Container>
  );
};

export const loader: LoaderFunction = createAuthenticatedLoader(
  (userId, params) => getFundraiseData({ uuid: params.id || "", userId })
);

export const action: ActionFunction = async ({ request, params }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
      }
      if (request.method === "DELETE") {
        const uuid = params["uuid"];
        if (!uuid) throw new Response("`uuid` is required", { status: 400 });
        if (typeof uuid !== "string")
          throw new Response("`uuid` must be a string", { status: 400 });
        return deleteAgreement({ uuid, userId });
      } else if (request.method === "POST") {
        const formData = await request.formData();

        const uuid = params["id"];
        if (!uuid) throw new Response("`id` is required", { status: 400 });
        if (typeof uuid !== "string")
          throw new Response("`id` must be a string", { status: 400 });

        const name = formData.get("name");
        if (!name) throw new Response("`name` is required", { status: 400 });
        if (typeof name !== "string")
          throw new Response("`name` must be a string", { status: 400 });

        const email = formData.get("email");
        if (!email) throw new Response("`email` is required", { status: 400 });
        if (typeof email !== "string")
          throw new Response("`email` must be a string", { status: 400 });

        const _amount = formData.get("amount");
        if (!_amount)
          throw new Response("`amount` is required", { status: 400 });
        const amount = Number(_amount);
        if (isNaN(amount))
          throw new Response("`amount` must be a number", { status: 400 });

        return import("@clerk/clerk-sdk-node")
          .then((clerk) => clerk.users.getUser(userId))
          .then((user) => inviteInvestor({ uuid, user, email, amount, name }));
      } else {
        throw new Response(`Method ${request.method} Not Found`, {
          status: 404,
        });
      }
    });
};

const TopBarWidgets = ({ data }: { data: LoaderData }) => {
  const rowsToSign = useMemo(
    () =>
      data.agreements.filter(
        (row) => CONTRACT_STAGES[row.status] === "CONFIRM_NEW_BACKER"
      ),
    [data]
  );
  return (
    <UpdatePill>
      {rowsToSign.length > 0 && <span>🎉 </span>}
      <span>
        <b>{rowsToSign.length}</b> New
      </span>
    </UpdatePill>
  );
};

export const handle = {
  title: "My Fundraise",
  secondaryLabel: "Copy Fundraise Link",
  onSecondary: ({
    data,
    params,
  }: {
    data: LoaderData;
    params: Record<string, string>;
  }) => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/creator/${data.userId}?fundraise=${params.id}`
    );
    document.querySelector(`#container`)?.dispatchEvent(new Event("copied"));
  },
  TopBarWidgets,
};

export default UserFundraisesContract;
