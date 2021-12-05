import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import PrivacyPolicy from "@dvargas92495/ui/dist/components/PrivacyPolicy";

const PrivacyPolicyPage: React.FunctionComponent = () => (
  <Layout>
    <PrivacyPolicy name={"crowdinvestin-me"} domain={"crowdinvestin.me"} />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Privacy Policy"} />
);
export default PrivacyPolicyPage;