import React from "react";
import Layout, { getMeta } from "~/_common/Layout";
import PrivacyPolicy from "@dvargas92495/ui/dist/components/PrivacyPolicy";

const PrivacyPolicyPage: React.FunctionComponent = () => (
  <Layout>
    <PrivacyPolicy name={"constancy-fund"} domain={"constancy.fund"} />
  </Layout>
);

export const Head = getMeta({ title: "Privacy Policy" });

export default PrivacyPolicyPage;
