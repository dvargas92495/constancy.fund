import Loading from "@dvargas92495/ui/dist/components/Loading";
import React, { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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

const H1 = (props: Parameters<typeof _H1>[0]) => (
  <_H1 sx={{ fontSize: 30, ...props.sx }} {...props} />
);

const FUNDRAISE_NAMES_BY_IDS = Object.fromEntries(
  FUNDRAISE_TYPES.map(({ name, id }) => [id, name])
);

type Agreements = Awaited<ReturnType<GetContractHandler>>["agreements"];
const STAGE_COLORS = [
  "#C4C4C4",
  "#A2F159",
  "#D4E862",
  "#2FEC00",
  "#FF8B8B",
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
      <Box
        component={"span"}
        sx={{
          color: "#0000EE",
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
            cursor: "pointer",
          },
        }}
        onClick={() => {
          setLoading(true);
          deleteHandler({ uuid: row.uuid })
            .then(() => row.onDelete(row.uuid))
            .finally(() => setLoading(false));
        }}
      >
        <Box component={"span"} sx={{ marginRight: 16 }}>
          Remove Invitation
        </Box>{" "}
        <Loading loading={loading} size={16} />
      </Box>
    );
  },
  (row) => (
    <ExternalLink href={`/contract?uuid=${row.uuid}&signer=1`}>
      Send Link To Investor
    </ExternalLink>
  ),
  (row) => (
    <ExternalLink href={`/contract?uuid=${row.uuid}&signer=2`}>
      Sign Contract
    </ExternalLink>
  ),
  (row) => (
    <ExternalLink href={`/_contracts/${row.contractUuid}/${row.uuid}.pdf`}>
      View Contract
    </ExternalLink>
  ),
  () => <span />,
  () => <span />,
];

const AgreementRow = (
  row: Agreements[number] & {
    contractUuid: string;
    onDelete: (uuid: string) => void;
  }
) => {
  const StageAction = STAGE_ACTIONS[row.status];
  return (
    <TableRow>
      <TableCell>{row.name}</TableCell>
      <TableCell>${formatAmount(row.amount)}</TableCell>
      <TableCell>
        <Box
          sx={{
            height: 24,
            borderRadius: 12,
            px: "40px",
            py: "4px",
            backgroundColor: STAGE_COLORS[row.status],
            width: "fit-content",
            textAlign: "center",
          }}
        >
          {CONTRACT_STAGES[row.status].replace(/_/g, " ").toLowerCase()}
        </Box>
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
  return (
    <>
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
      </Box>
      <H1
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              />
            ))}
          </TableBody>
        </Table>
      </Box>
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
