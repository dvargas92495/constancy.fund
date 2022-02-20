import React from "react";
import getMeta from "~/_common/getMeta";
import PrivacyPolicy from "@dvargas92495/ui/dist/components/PrivacyPolicy";

const PrivacyPolicyPage: React.FunctionComponent = () => (
  <PrivacyPolicy name={"constancy-fund"} domain={"constancy.fund"} />
);

export const Head = getMeta({ title: "Privacy Policy" });

export default PrivacyPolicyPage;
