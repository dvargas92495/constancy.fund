import React from "react";
import getMeta from "~/_common/getMeta";
import TermsOfUse from "@dvargas92495/ui/dist/components/TermsOfUse";

const TermsOfUsePage: React.FC = () => (
  <TermsOfUse name={"constancy-fund"} domain={"constancy.fund"} />
);

export const Head = getMeta({ title: "Terms of Use" });

export default TermsOfUsePage;
