import React from "react";
import getMeta from "~/_common/getMeta";
import TermsOfUse from "@dvargas92495/ui/components/TermsOfUse";

const TermsOfUsePage: React.FC = () => (
  <TermsOfUse name={"constancy-fund"} domain={"constancy.fund"} />
);

export const meta = getMeta({ title: "Terms of Use" });
export default TermsOfUsePage;
