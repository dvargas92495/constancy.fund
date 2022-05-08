import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { render as renderInvestorSigned } from "../app/emails/InvestorSigned";
import { render as renderCreatorSigned } from "../app/emails/CreatorSigned";
import { render as renderInvitation } from "../app/emails/InvitationToFund";
import React from "react";

const RENDERS: Record<string, (args: any) => React.ReactElement> = {
  "investor-signed": renderInvestorSigned,
  "creator-signed": renderCreatorSigned,
  "invitation-to-fund": renderInvitation,
};

export const handler = ({
  bodyComponent,
  bodyProps,
  ...params
}: {
  to: string;
  replyTo: string;
  subject: string;
  bodyProps: Record<string, unknown>;
  bodyComponent: string;
}) => {
  return sendEmail({
    ...params,
    body: RENDERS[bodyComponent](bodyProps),
  });
};
