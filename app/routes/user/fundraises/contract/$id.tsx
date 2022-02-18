import React, { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import { UserButton } from "@clerk/clerk-react";

import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import TableBody from "@mui/material/TableBody";
import type { Handler as GetContractHandler } from "../../../../../functions/contract/get";
import type { Handler as PostAgreementHandler } from "../../../../../functions/agreement/post";
import type { Handler as DeleteAgreementHandler } from "../../../../../functions/agreement/delete";
import FUNDRAISE_TYPES from "../../../../../db/fundraise_types";
import CONTRACT_STAGES from "../../../../../db/contract_stages";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import {
  Link as RemixLink,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useParams,
} from "remix";
import formatAmount from "../../../../../db/util/formatAmount";
import cookie from "cookie";
import axios from "axios";
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
  padding: 20px;
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

const TableHead = styled.thead`
  border-radius: 8px;
  background-color: ${(props) =>
    props.theme.palette.color.backgroundColorDarker};
  display: table-header-group;
  align-items: center;
  width: fill-available;
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 500;
  height: 60px !important;
`;

const Table = styled.table`
  border-radius: 12px;
  overflow: hidden;
  border-spacing: 0px;
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
  border-bottom: 1px solid ${(props) => props.theme.palette.color.lightgrey};
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
  height: 40px;
  padding: 5px 20px;
  border-radius: 8px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
  width: fit-content;
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

const H1 = (props: Parameters<typeof _H1>[0]) => (
  <_H1 sx={{ fontSize: 30, ...props.sx }} {...props} />
);

const FUNDRAISE_NAMES_BY_IDS = Object.fromEntries(
  FUNDRAISE_TYPES.map(({ name, id }) => [id, name])
);

type Agreements = Awaited<ReturnType<GetContractHandler>>["agreements"];
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
    const deleteHandler = useAuthenticatedHandler<DeleteAgreementHandler>({
      path: "agreement",
      method: "DELETE",
    });
    const [loading, setLoading] = useState(false);
    return (
      <>
        {!loading ? (
          <>
            <IconContainer
              onClick={() => {
                setLoading(true);
                deleteHandler({ uuid: row.uuid })
                  .then(() => row.onDelete(row.uuid))
                  .finally(() => setLoading(false));
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
      Send Link To Investor
    </Link>
  ),
  (row) => (
    <Link href={`/contract?uuid=${row.uuid}&signer=2`}>Sign Contract</Link>
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
        <TopText>{row.name}</TopText>
        <BottomText>{row.email}</BottomText>
      </TableCell>
      <TableCell>
        <TopText>${formatAmount(row.amount)}</TopText>
        <BottomText>{ProgressPercentage} %</BottomText>
      </TableCell>
      <TableCell>
        <StagePill color={STAGE_COLORS[row.status]}>
          {CONTRACT_STAGES[row.status].replace(/_/g, " ").toUpperCase()}
        </StagePill>
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

type FundraiseData = Awaited<ReturnType<GetContractHandler>>;

const UserFundraisesContract = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const fundraiseData = useLoaderData<FundraiseData>();
  const type = fundraiseData.type;
  const [rows, setRows] = useState<Agreements>(fundraiseData.agreements);

  const total = useMemo(
    () =>
      Number(fundraiseData.details.amount) *
      (Number(fundraiseData.details.frequency) || 1),
    [fundraiseData]
  );
  const progress = useMemo(
    () => rows.reduce((p, c) => p + c.amount, 0),
    [rows]
  );
  // const [error, setError] = useState("");

  const capSpace = useMemo(() => total - progress, [total, progress]);
  const postAgreement = useAuthenticatedHandler<PostAgreementHandler>({
    path: "agreement",
    method: "POST",
  });
  const onDelete = useCallback(
    (uuid: string) => setRows(rows.filter((r) => r.uuid !== uuid)),
    [setRows, rows]
  );
  const { isOpen: defaultIsOpen } = (location.state || {}) as {
    isOpen?: boolean;
  };

  const ProgressPercentage = Math.round(
    (Number(progress) / Number(total)) * 100
  );

  return (
    <>
      <TopBar>
        <InfoArea>
          <PageTitle>Your Fundraise</PageTitle>
          <UpdatePill>
            {rows.filter((row) => row.status === 2).length > 0 && (
              <span>🎉 </span>
            )}
            <span>
              <b>{rows.filter((row) => row.status === 2).length}</b> New
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
                <ProgressPillProgress>
                  ${formatAmount(progress)}
                </ProgressPillProgress>
                <ProgressPillSeparator />
                <ProgressPillRear>
                  <ProgressPillTotal>{formatAmount(total)}</ProgressPillTotal>
                  <ProgressPillHelpText>/ month</ProgressPillHelpText>
                </ProgressPillRear>
              </ProgressPill>
            </TitleTopBox>
            <Spacer height={"20px"} />
            <ProgressBar progress={ProgressPercentage} />
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
                <ConditionsTitle>30.000</ConditionsTitle>
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
                <ConditionsTitle>60.000</ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
            <ConditionsBox>
              <SectionCircle width={"30px"} margin={"0"}>
                <Icon name={"split"} color={"purple"} heightAndWidth={"15px"} />
              </SectionCircle>
              <ConditionsContent>
                <ConditionsSubTitle>Shares Revenue</ConditionsSubTitle>
                <ConditionsTitle>12%</ConditionsTitle>
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
                <ConditionsSubTitle>Income Threshold</ConditionsSubTitle>
                <ConditionsTitle>
                  30.000<SmallConditionsText>/year</SmallConditionsText>
                </ConditionsTitle>
              </ConditionsContent>
            </ConditionsBox>
          </ConditionsContainer>

          {/* // {FUNDRAISE_NAMES_BY_IDS[type]} */}
          <Section>
            <TitleTopBoxSmall>
              <SectionTitle margin={"0px"}>Your Investors</SectionTitle>
              <ProgressPillSmall>
                <ProgressPillProgress>
                  Confirmed:{" "}
                  <b>{rows.filter((row) => row.status === 3).length}</b>
                </ProgressPillProgress>
              </ProgressPillSmall>
            </TitleTopBoxSmall>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Investor</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
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

        {/* <H1
          sx={{
            fontSize: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component={"span"}
            sx={{
              a: {
                textDecoration: "none",
                color: "#333333",
              },
            }}
          >
            <RemixLink to={"/fundraises"}>Your Fundraises</RemixLink>
            {" > "}
            {FUNDRAISE_NAMES_BY_IDS[type]}
          </Box>
          <FormDialog<{ name: string; email: string; amount: number }>
            formElements={{
              name: {
                defaultValue: "",
                order: 0,
                component: StringField,
                validate: (s) => (!s ? "Name is required" : ""),
              },
              email: {
                defaultValue: "",
                order: 1,
                component: StringField,
                validate: (s) => (!s ? "Email is required" : ""),
              },
              amount: {
                defaultValue: 0,
                order: 2,
                component: NumberField,
                validate: (n) => {
                  if (n < 100) {
                    return "Amount must be greater than $100";
                  }
                  if (capSpace < n) {
                    return `Requested more than available cap space: $${formatAmount(
                      capSpace
                    )}`;
                  }
                  return "";
                },
              },
            }}
            title={"Invite New Investor"}
            buttonText={"Invite Investor"}
            onSave={(body) =>
              postAgreement({ uuid: id, ...body }).then((r) =>
                setRows([...rows, { ...body, uuid: r.uuid, status: 0 }])
              )
            }
            defaultIsOpen={defaultIsOpen}
          />
        </H1>

        <Box>
          <p>
            <b>Wants to raise: </b>${formatAmount(total)}
          </p>
          <p>
            <b>Pays Back: </b>$
            {formatAmount((total * Number(fundraiseData.details.return)) / 100)}
          </p>
          <p>
            <b>Shares Revenue: </b>
            {Number(fundraiseData.details.share)}%
          </p>
          <p>
            <b>Income Threshold: </b>$
            {formatAmount(Number(fundraiseData.details.threshold))} / year
          </p>
          <p>
            <b>Progress: </b>${formatAmount(progress)} / {formatAmount(total)}
          </p>
          <p>
            <b>Progress Investors: </b>
            {rows.length}
          </p>
          <p>
            <b>Progress New: </b>
            {rows.filter((row) => row.status === 2).length}
          </p>
        </Box> */}
      </ContentContainer>
    </>
  );
};

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

export default UserFundraisesContract;
