import { useState } from "react";
import { Link, LoaderFunction, Outlet, useLoaderData, useMatches } from "remix";
import styled from "styled-components";
import getEmailData from "~/data/getEmailData.server";
import TextFieldDescription from "~/_common/TextFieldDescription";
import TextFieldBox from "~/_common/TextFieldBox";
import TextInputContainer from "~/_common/TextInputContainer";

export const loader: LoaderFunction = () => {
  const development = process.env.NODE_ENV === "development";
  return development
    ? getEmailData().then((a) => ({ ...a, development }))
    : { development };
};

const RootContainer = styled.div`
  display: flex;
  gap: 128px;
  min-width: 60vw;
  height: 100%;
`;

const PreviewBoundary = styled.div`
  border: 1px solid black;
  flex-grow: 1;
`;

const PreviewContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EmailsRoute = () => {
  const data = useLoaderData<
    { development: boolean } & Awaited<ReturnType<typeof getEmailData>>
  >();
  const [user, setUser] = useState(0);
  const [agreement, setAgreement] = useState(0);
  const isRoot = useMatches().slice(-1)[0].id === "routes/admin/emails";
  return data.development ? (
    <RootContainer>
      <div>
        <h1>Email Templates</h1>
        <ul>
          <li>
            <Link to={"creator-signed"}>Creator Signed</Link>
          </li>
          <li>
            <Link to={"investor-signed"}>Investor Signed</Link>
          </li>
          <li>
            <Link to={"invitation-to-fund"}>Invitation To Fund</Link>
          </li>
        </ul>
        {!isRoot && (
          <div>
            <h1>Config</h1>
            <TextFieldBox>
              <TextFieldDescription>Creator</TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <select
                  value={user}
                  style={{  maxHeight: 200  }}
                  onChange={(e) => setUser(Number(e.target.value))}
                  required
                >
                  {data.users.map((c, index) => (
                    <option value={index} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription>Agreement</TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <select
                  value={agreement}
                  style={{  maxHeight: 200  }}
                  onChange={(e) => setAgreement(Number(e.target.value))}
                  required
                >
                  {data.ids.map((c, index) => (
                    <option value={index} key={c.uuid}>
                      {c.type}
                    </option>
                  ))}
                </select>
              </TextInputContainer>
            </TextFieldBox>
          </div>
        )}
      </div>
      {!isRoot && (
        <PreviewContainer>
          <h1>Preview</h1>
          <PreviewBoundary>
            <Outlet
              context={{
                investorName: data.ids[agreement].investor.name,
                investorPaymentPreferences: data.ids[agreement].investor.paymentPreferences,
                creatorId: data.users[user].id,
                creatorName: data.users[user].name,
                creatorPaymentPreferences: data.users[user].paymentPreferences,
                agreementUuid: data.ids[agreement].uuid,
                contractType: data.ids[agreement].type,
                contractDetails: data.ids[agreement].details,
                agreementAmount: data.ids[agreement].amount,
              }}
            />
          </PreviewBoundary>
        </PreviewContainer>
      )}
    </RootContainer>
  ) : (
    <div>This page is only available in development!</div>
  );
};

export default EmailsRoute;
