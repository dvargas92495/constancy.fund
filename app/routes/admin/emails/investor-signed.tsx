import { useOutletContext } from "remix";
import InvestorSigned from "~/emails/InvestorSigned";

const PreviewInvestorSigned = () => {
  const data = useOutletContext<Parameters<typeof InvestorSigned>[0]>();
  return <InvestorSigned {...data} />;
};

export default PreviewInvestorSigned;
