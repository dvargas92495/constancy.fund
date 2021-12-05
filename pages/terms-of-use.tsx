import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import TermsOfUse from "@dvargas92495/ui/dist/components/TermsOfUse";

const TermsOfUsePage: React.FC = () => (
  <Layout>
    <TermsOfUse name={"crowdinvestin-me"} domain={"crowdinvestin.me"} />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Terms of Use"} />
);
export default TermsOfUsePage;
