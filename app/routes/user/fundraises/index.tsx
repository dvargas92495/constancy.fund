import React, { useState, useCallback, useEffect } from "react";
import { LoaderFunction, redirect, ActionFunction } from "@remix-run/node";
import { useNavigate, useLoaderData, useFetcher, Link } from "@remix-run/react";
import deleteFundraiseData from "~/data/deleteFundraiseData.server";
import Icon from "~/_common/Icon";
import { PrimaryAction } from "~/_common/PrimaryAction";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import SectionCircle from "~/_common/SectionCircle";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import styled from "styled-components";
import formatAmount from "~/util/formatAmount";
import getFundraises from "~/data/getFundraises.server";
import createAuthenticatedLoader from "~/data/createAuthenticatedLoader";
import { SecondaryAction } from "~/_common/SecondaryAction";
import { useDashboardActions } from "~/_common/DashboardActionContext";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";

const NotCompletedMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
`;

const FundraisingContainer = styled.div``;

const H4 = styled.h4`
  font-size: 20px;
`;

type Data = Awaited<ReturnType<typeof getFundraises>>;
type Fundraises = Data["fundraises"];

const CellContainer = styled.div`
  display: flex;
  & p {
    margin-top: 0;
  }
`;

const CollapseContainer = styled.div`
  min-width: 40px;
`;

const DetailComponentById: Record<
  string,
  (props: {
    clauses: string[];
    details: { [k: string]: string };
  }) => React.ReactElement
> = {
  isa: (props) => {
    const {
      details: {
        amount,
        cap,
        frequency = 1,
        return: financialReturn,
        share,
        supportType,
        threshold,
      },
      clauses,
    } = props;
    const [showMore, setShowMore] = useState(false);
    return (
      <CellContainer>
        <CollapseContainer>
          {showMore ? (
            <Icon
              name={"arrow-drop-down"}
              onClick={() => setShowMore(false)}
              heightAndWidth={"24px"}
            />
          ) : (
            <Icon
              name={"arrow-right"}
              onClick={() => setShowMore(true)}
              heightAndWidth={"24px"}
            />
          )}
        </CollapseContainer>
        <div>
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
              {!!clauses.length && (
                <>
                  <p>Additional clauses:</p>
                  <ul>
                    {clauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </CellContainer>
    );
  },
  loan: () => <div>Coming Soon!</div>,
  safe: () => <div>Coming Soon!</div>,
  saft: () => <div>Coming Soon!</div>,
};

const ActionCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
`;

const FundraiseContentRow = (row: Fundraises[number]) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const onPreview = useCallback(() => {
    navigate(`/user/fundraises/${row.uuid}/preview`);
  }, [navigate, row.uuid]);
  const DetailComponent = DetailComponentById[row.type];
  const onDelete = useCallback(() => {
    fetcher.submit({ uuid: row.uuid }, { method: "delete" });
  }, [row.uuid, fetcher]);
  return (
    <tr>
      <td style={{ minWidth: "120px", verticalAlign: "top" }}>
        <Link to={`/user/fundraises/${row.uuid}`}>{row.type}</Link>
      </td>
      <td style={{ minWidth: "320px", verticalAlign: "top" }}>
        <DetailComponent
          details={row.details}
          clauses={Array.from(row.clauses)}
        />
      </td>
      <td style={{ minWidth: "120px", verticalAlign: "top" }}>
        {row.progress}
      </td>
      <td style={{ minWidth: "120px", verticalAlign: "top" }}>
        {row.investorCount}
      </td>
      <td style={{ minWidth: "240px", verticalAlign: "top" }}>
        <ActionCell>
          <SecondaryAction
            onClick={() => {
              navigate(`/user/fundraises/${row.uuid}`);
            }}
            label={"See Investors"}
            width={"100%"}
          />
          <SecondaryAction
            onClick={onPreview}
            label={"Preview"}
            width={"100%"}
          />
          <SecondaryAction onClick={onDelete} label={"Delete"} width={"100%"} />
        </ActionCell>
      </td>
    </tr>
  );
};

const FirstContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const handle = {
  title: "My Fundraise",
  secondaryLabel: "Fill Profile",
  onSecondary: () => window.location.assign(`/user`),
};

const UserFundraiseIndex = () => {
  const data = useLoaderData<Data>();
  const navigate = useNavigate();

  const { setShowSecondary } = useDashboardActions();
  useEffect(() => {
    setShowSecondary(data.completed);
  }, [setShowSecondary, data]);
  return (
    <Container>
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
            (data.fundraises.length ? (
              <FundraisingContainer>
                <table style={{ minWidth: 650 }} aria-label="simple table">
                  <thead>
                    <tr>
                      <td>Type</td>
                      <td>Details</td>
                      <td>Progress</td>
                      <td># Investors</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fundraises.map((row) => (
                      <FundraiseContentRow key={row.uuid} {...row} />
                    ))}
                  </tbody>
                </table>
              </FundraisingContainer>
            ) : (
              <FirstContainer>
                <H4>Set up your first fundraise</H4>
                <PrimaryAction
                  label={"Start New Fundraise"}
                  onClick={() => navigate(`/user/fundraises/setup`)}
                />
              </FirstContainer>
            ))}
        </Section>
      </ContentContainer>
    </Container>
  );
};

export const loader: LoaderFunction = (args) =>
  createAuthenticatedLoader((userId, params) =>
    getFundraises({ userId })
      .then((r) => {
        if (!r.completed || params["stay"]) {
          return r;
        } else if (r.fundraises.length) {
          return redirect(`/user/fundraises/${r.fundraises[0].uuid}`);
        } else {
          return redirect(`/user/fundraises/setup`);
        }
      })
      .catch((e) => {
        console.error(e);
        return {};
      })
  )(args);

export const action: ActionFunction = async ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
      }
      if (request.method === "DELETE") {
        const formData = await request.formData();
        const uuid = formData.get("uuid");
        if (!uuid) return new Response("`uuid` is required", { status: 400 });
        if (typeof uuid !== "string")
          return new Response("`uuid` must be a string", { status: 400 });
        return deleteFundraiseData({ uuid, userId });
      } else {
        throw new Response(`Method ${request.method} Not Found`, {
          status: 404,
        });
      }
    });
};

export default UserFundraiseIndex;
