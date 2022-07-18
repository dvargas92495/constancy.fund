import { useOutletContext } from "@remix-run/react";
import InvitationToFund from "~/emails/InvitationToFund";

const PreviewInvitationToFund = () => {
  const data = useOutletContext<Parameters<typeof InvitationToFund>[0]>();
  return <InvitationToFund {...data} />;
};

export default PreviewInvitationToFund;
