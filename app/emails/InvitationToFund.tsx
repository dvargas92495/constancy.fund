import EmailLayout from "./EmailLayout";
import React from "react";

const InvitationToFund = ({
  investorName,
  creatorName,
  creatorId,
  agreementUuid,
}: {
  investorName: string;
  creatorName: string;
  creatorId: string;
  agreementUuid: string;
}): React.ReactElement => {
  return (
    <EmailLayout>
      <p>Hi {investorName},</p>
      <p>
        You have been invited to invest in {creatorName}.{" "}
        <a
          href={`${process.env.ORIGIN}/creator/${creatorId}?agreement=${agreementUuid}`}
        >
          Click here
        </a>{" "}
        to visit this creator&apos;s public profile and enter your details.
      </p>
      <hr />
      <p>
        You could ask the creator any questions by directly replying to this
        email.
      </p>
    </EmailLayout>
  );
};

export const render = (props: Parameters<typeof InvitationToFund>[0]) => (
  <InvitationToFund {...props} />
);

export default InvitationToFund;
