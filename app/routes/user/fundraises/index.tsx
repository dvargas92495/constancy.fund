import React, { useMemo, useEffect, useState, useCallback } from "react";
import { UserButton, useUser } from "@clerk/remix";
import Box from "@mui/material/Box";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
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
import type { Handler as DeleteHandler } from "../../../../functions/contract/delete";
import type { Handler as GetHandler } from "../../../../functions/fundraises/get";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "remix";
import Icon from "~/_common/Icon";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { LoadingIndicator } from "~/_common/LoadingIndicator";
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

const NotCompletedMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const FundraisingContainer = styled.div``;

const LoadingBox = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
);

type Fundraises = Awaited<ReturnType<GetHandler>>["fundraises"];

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
  const [isOpen, setIsOpen] = useState<HTMLButtonElement | undefined>();
  const deleteHandler = useAuthenticatedHandler<DeleteHandler>({
    method: "DELETE",
    path: "contract",
  });
  const onDelete = useCallback(() => {
    deleteHandler({
      uuid: row.uuid,
    }).then(() => onDeleteSuccess(row.uuid));
  }, [row]);
  const navigate = useNavigate();
  const onPreview = useCallback(() => {
    navigate(`/user/fundraises/preview/${row.uuid}`);
  }, [navigate, row.uuid]);
  const DetailComponent = DetailComponentById[row.type];
  return (
    <TableRow>
      <TableCell>{row.type}</TableCell>
      <TableCell sx={{ width: "320px" }}>
        <DetailComponent
          {...Object.fromEntries(row.details.map((d) => [d.label, d.value]))}
        />
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
  const {
    publicMetadata: { completed = false },
  } = user;
  const [error] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Fundraises>([]);
  const getFundraises = useAuthenticatedHandler<GetHandler>({
    path: "fundraises",
    method: "GET",
  });
  const onDeleteSuccess = useCallback(
    (uuid: string) => {
      setRows(rows.filter((r) => r.uuid !== uuid));
    },
    [setRows, rows]
  );
  useEffect(() => {
    if (completed) {
      setLoading(true);
      getFundraises()
        .then((r) => setRows(r.fundraises))
        .finally(() => setLoading(false));
    }
  }, [getFundraises, setRows, setLoading, completed]);
  const navigate = useNavigate();
  const startFundraiseButton = useMemo(
    () => (
      <Button
        variant={"contained"}
        onClick={() => navigate(`/user/fundraises/setup`)}
      >
        Start New Fundraise
      </Button>
    ),
    [navigate]
  );
  const Container: React.FC = loading
    ? ({ children }) => (
        <Skeleton variant={"rectangular"} sx={{ minHeight: "60vh" }}>
          {children}
        </Skeleton>
      )
    : Box;
  return (
    <>
      <TopBar>
        <InfoArea>
          <PageTitle>My Fundraise</PageTitle>
          <ActionButton>
            {!completed && (
              <PrimaryAction
                onClick={() => navigate(`/user`)}
                isLoading={loading}
                label={"Fill Profile"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
              />
            )}
            <span color={"darkred"}>{error}</span>
          </ActionButton>
        </InfoArea>
        <UserButton />
      </TopBar>
      <ContentContainer>
        <Section>
          {!completed && (
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
                isLoading={loading}
                label={"Get Started"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
              />
            </NotCompletedMessageContainer>
          )}
          {rows.length ? (
            <Container>
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
                {!rows.length && (
                  <Box sx={{ mt: 4 }} textAlign={"center"}>
                    <H4>Set up your first fundraise</H4>
                    {startFundraiseButton}
                  </Box>
                )}
              </FundraisingContainer>
            </Container>
          ) : (
            <LoadingBox>
              <LoadingIndicator />
              <FundraisingContainer
                onClick={() => navigate(`/user/fundraises/setup`)}
              />
            </LoadingBox>
          )}
        </Section>
      </ContentContainer>
    </>
  );
};

export default UserFundraiseIndex;
