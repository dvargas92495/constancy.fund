import React from "react";
import Layout, { getMeta } from "~/_common/Layout";
import TermsOfUse from "@dvargas92495/ui/dist/components/TermsOfUse";

const TermsOfUsePage: React.FC = () => (
  <Layout>
    <TermsOfUse name={"constancy-fund"} domain={"constancy.fund"} />
  </Layout>
);

export const Head = getMeta({ title: "Terms of Use" });

export default TermsOfUsePage;
