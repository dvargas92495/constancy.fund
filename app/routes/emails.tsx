import { useState } from "react";
import { Link, LoaderFunction, Outlet, useLoaderData, useMatches } from "remix";
import styled from "styled-components";
import getEmailData from "../data/getEmailData.server";
import TextFieldDescription from "../_common/TextFieldDescription";
import TextFieldBox from "../_common/TextFieldBox";
import TextInputContainer from "../_common/TextInputContainer";
import TextInputOneLine from "../_common/TextInputOneLine";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const loader: LoaderFunction = () => {
  const development = process.env.NODE_ENV === "development";
  return development
    ? getEmailData().then((a) => ({ ...a, development }))
    : { development };
};

const RootContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 60vw;
`;

const PreviewBoundary = styled.div`
  border: 1px solid black;
`;

const EmailsRoute = () => {
  const data = useLoaderData<
    { development: boolean } & Awaited<ReturnType<typeof getEmailData>>
  >();
  const [investorName, setInvestorName] = useState("");
  const [user, setUser] = useState(0);
  const [agreement, setAgreement] = useState(0);
  const isRoot = useMatches().slice(-1)[0].id === "routes/emails/index";
  return data.development ? (
    <RootContainer>
      <div>
        <h1>Email Templates</h1>
        <ul>
          <li>
            <Link to={"/emails/creator-signed"}>Creator Signed</Link>
          </li>
          <li>
            <Link to={"/emails/investor-signed"}>Investor Signed</Link>
          </li>
          <li>
            <Link to={"/emails/invitation-to-fund"}>Invitation To Fund</Link>
          </li>
        </ul>
        {!isRoot && (
          <div>
            <h1>Config</h1>
            <TextFieldBox>
              <TextFieldDescription>Investor Name</TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <TextInputOneLine
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription>Creator</TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <Select
                  value={user}
                  maxRows={10}
                  MenuProps={{ sx: { maxHeight: 200 } }}
                  onChange={(e) => setUser(Number(e.target.value))}
                  fullWidth
                  required
                >
                  {data.users.map((c, index) => (
                    <MenuItem value={index} key={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription>Agreement</TextFieldDescription>
              <TextInputContainer width={"350px"}>
                <Select
                  value={agreement}
                  maxRows={10}
                  MenuProps={{ sx: { maxHeight: 200 } }}
                  onChange={(e) => setAgreement(Number(e.target.value))}
                  fullWidth
                  required
                >
                  {data.ids.map((c, index) => (
                    <MenuItem value={index} key={c.uuid}>
                      {c.type}
                    </MenuItem>
                  ))}
                </Select>
              </TextInputContainer>
            </TextFieldBox>
          </div>
        )}
      </div>
      {!isRoot && (
        <div>
          <h1>Preview</h1>
          <PreviewBoundary>
            <Outlet
              context={{
                investorName: investorName,
                creatorId: data.users[user].id,
                creatorName: data.users[user].name,
                creatorPaymentPreferences: data.users[user].paymentPreferences,
                agreementUuid: data.ids[agreement].uuid,
                contractType: data.ids[agreement].type,
              }}
            />
          </PreviewBoundary>
        </div>
      )}
    </RootContainer>
  ) : (
    <div>This page is only available in development!</div>
  );
};

export default EmailsRoute;
