import React, { useState, useCallback } from "react";
import { UserButton, useUser } from "@clerk/remix";
import {
  LoaderFunction,
  useNavigate,
  redirect,
  useLoaderData,
  ActionFunction,
  useFetcher,
} from "remix";
import Box from "@mui/material/Box";
import _H1 from "@dvargas92495/ui/components/H1";
import _H4 from "@dvargas92495/ui/components/H4";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "~/_common/ListItemIcon";
import ListItemText from "~/_common/ListItemText";
import deleteFundraiseData from "~/data/deleteFundraiseData.server";
import Icon from "~/_common/Icon";
import { PrimaryAction } from "~/_common/PrimaryAction";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ActionButton from "~/_common/ActionButton";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import SectionCircle from "~/_common/SectionCircle";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import styled from "styled-components";
import formatAmount from "../../../../db/util/formatAmount";
import getFundraises from "~/data/getFundraises.server";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";

const NotCompletedMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 1000px;
`;

const FundraisingContainer = styled.div``;

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
);

type Data = Awaited<ReturnType<typeof getFundraises>>;
type Fundraises = Data["fundraises"];

const DetailComponentById: Record<
  string,
  (props: Record<string, string>) => React.ReactElement
> = {
  isa: (props) => {
    const {
      amount,
      cap,
      frequency = 1,
      return: financialReturn,
      share,
      supportType,
      threshold,
      clauses,
    } = props;
    const [showMore, setShowMore] = useState(false);
    return (
      <Box
        display={"flex"}
        sx={{
          "& p": {
            marginTop: 0,
          },
        }}
      >
        <Box sx={{ minWidth: "40px" }}>
          {showMore ? (
            <IconButton onClick={() => setShowMore(false)}>
              <Icon name={"arrow-drop-down"} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setShowMore(true)}>
              <Icon name={"arrow-right"} />
            </IconButton>
          )}
        </Box>
        <Box>
          <p>
            {" "}
            Looking to raise <b>${formatAmount(Number(amount))}</b> paid out{" "}
            <b>{supportType}</b>
            {supportType === "once" ? "" : `, ${frequency} times.`}
          </p>
          {showMore && (
            <>
              <p>
                Investor will receive {share}% of revenue above $
                {Number(threshold) / 12} per month
              </p>
              <p>Total will be capped at either</p>
              <ul>
                <li>{Number(financialReturn)}% of initial investment or</li>
                <li>{cap} years</li>
              </ul>
              <p>Additional clauses:</p>
              <ul>
                <li>{clauses}</li>
              </ul>
            </>
          )}
        </Box>
      </Box>
    );
  },
  loan: () => <div>Coming Soon!</div>,
  safe: () => <div>Coming Soon!</div>,
  saft: () => <div>Coming Soon!</div>,
};

const FundraiseContentRow = ({
  onDeleteSuccess,
  ...row
}: Fundraises[number] & { onDeleteSuccess: (uuid: string) => void }) => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState<HTMLButtonElement | undefined>();
  const navigate = useNavigate();
  const onPreview = useCallback(() => {
    navigate(`/user/fundraises/preview/${row.uuid}`);
  }, [navigate, row.uuid]);
  const DetailComponent = DetailComponentById[row.type];
  const onDelete = useCallback(() => {
    fetcher.submit(
      { uuid: row.uuid },
      { method: "delete", action: "/user/fundraises?index" }
    );
  }, [row.uuid, fetcher]);
  return (
    <TableRow>
      <TableCell>{row.type}</TableCell>
      <TableCell sx={{ width: "320px" }}>
        <DetailComponent {...row.details} />
      </TableCell>
      <TableCell>{row.progress}</TableCell>
      <TableCell>{row.investorCount}</TableCell>
      <TableCell sx={{ minWidth: "240px" }}>
        <Box flex={"display"} alignItems={"center"}>
          <Button
            variant="outlined"
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate(`/user/fundraises/contract/${row.uuid}`, {
                state: { isOpen: true },
              });
            }}
          >
            Invite Investor
          </Button>
          <IconButton onClick={(e) => setIsOpen(e.target as HTMLButtonElement)}>
            <Icon name={"more-vert"} />
          </IconButton>
        </Box>
        <Popover
          open={!!isOpen}
          anchorEl={isOpen}
          onClose={() => setIsOpen(undefined)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem
              button
              onClick={() => {
                navigate(`/user/fundraises/contract/${row.uuid}`);
              }}
              sx={{ display: "flex" }}
            >
              <ListItemIcon>
                <Icon name={"preview"} />
              </ListItemIcon>
              <ListItemText>See Investors</ListItemText>
            </ListItem>
            <ListItem button onClick={onPreview} sx={{ display: "flex" }}>
              <ListItemIcon>
                <Icon name={"preview"} />
              </ListItemIcon>
              <ListItemText>Preview</ListItemText>
            </ListItem>
            <ListItem button onClick={onDelete} sx={{ display: "flex" }}>
              <ListItemIcon>
                <Icon name={"delete"} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </ListItem>
          </List>
        </Popover>
      </TableCell>
    </TableRow>
  );
};

const UserFundraiseIndex = () => {
  const { isSignedIn, user } = useUser();
  if (!user || !isSignedIn) {
    throw new Error(`Somehow tried to load a non-logged in User profile`);
  }
  const data = useLoaderData<Data>();
  const [rows, setRows] = useState<Fundraises>(data.fundraises);
  const onDeleteSuccess = useCallback(
    (uuid: string) => {
      setRows(rows.filter((r) => r.uuid !== uuid));
    },
    [setRows, rows]
  );
  const navigate = useNavigate();
  return (
    <Container>
      <TopBar>
        <InfoArea>
          <PageTitle>My Fundraise</PageTitle>
          <ActionButton>
            {!data.completed && (
              <PrimaryAction
                onClick={() => navigate(`/user`)}
                label={"Fill Profile"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
              />
            )}
          </ActionButton>
        </InfoArea>
        <UserButton />
      </TopBar>
      <ContentContainer>
        <Section>
          {!data.completed && (
            <NotCompletedMessageContainer>
              <SectionCircle>
                <Icon
                  name={"personFine"}
                  heightAndWidth="24px"
                  color="purple"
                />
              </SectionCircle>
              <SubSectionTitle margin={"0 0 0 0"}>
                Fill out your profile to get started
              </SubSectionTitle>
              <InfoText>
                We need some details about your endeavour before we can start
                the fundraise
              </InfoText>
              <PrimaryAction
                onClick={() => navigate(`/user`)}
                label={"Get Started"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
              />
            </NotCompletedMessageContainer>
          )}
          {data.completed &&
            (rows.length ? (
              <FundraisingContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell># Investors</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <FundraiseContentRow
                        key={row.uuid}
                        {...row}
                        onDeleteSuccess={onDeleteSuccess}
                      />
                    ))}
                  </TableBody>
                </Table>
              </FundraisingContainer>
            ) : (
              <Box sx={{ mt: 4 }} textAlign={"center"}>
                <H4>Set up your first fundraise</H4>
                <Button
                  variant={"contained"}
                  onClick={() => navigate(`/user/fundraises/setup`)}
                >
                  Start New Fundraise
                </Button>
              </Box>
            ))}
        </Section>
      </ContentContainer>
    </Container>
  );
};

export const loader: LoaderFunction = createAuthenticatedLoader(
  (userId, params) =>
    getFundraises({ userId })
      .then((r) => {
        if (!r.completed || params["stay"]) {
          return r;
        } else if (r.fundraises.length) {
          return redirect(`/user/fundraises/contract/${r.fundraises[0].uuid}`);
        } else {
          return redirect(`/user/fundraises/setup`);
        }
      })
      .catch((e) => {
        console.error(e);
        return {};
      })
);

export const action: ActionFunction = async ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
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
        return deleteFundraiseData({ uuid, userId });
      } else {
        return {};
      }
    });
};

export default UserFundraiseIndex;
