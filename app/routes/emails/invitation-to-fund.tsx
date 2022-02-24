import { useLoaderData } from "remix";
import InvitationToFund from "../../emails/InvitationToFund";
import { useState } from "react";
import getEmailData from "../../data/getEmailData.server";
import TextFieldDescription from "../../_common/TextFieldDescription";
import TextFieldBox from "../../_common/TextFieldBox";
import TextInputContainer from "../../_common/TextInputContainer";
import TextInputOneLine from "../../_common/TextInputOneLine";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";

export const loader = getEmailData;

const PreviewBoundary = styled.div`
  border: 1px solid black;
`;

const PreviewInvitationToFund = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getEmailData>>>();
  const [investorName, setInvestorName] = useState("");
  const [user, setUser] = useState(0);
  const [agreement, setAgreement] = useState(0);
  return (
    <div>
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
                <MenuItem value={index} key={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </TextInputContainer>
        </TextFieldBox>
      </div>
      <hr />
      <div>
        <h1>Preview</h1>
        <PreviewBoundary>
          <InvitationToFund
            investorName={investorName}
            creatorId={data.users[user].id}
            creatorName={data.users[user].name}
            agreementUuid={data.ids[agreement]}
          />
        </PreviewBoundary>
      </div>
    </div>
  );
};

export default PreviewInvitationToFund;
