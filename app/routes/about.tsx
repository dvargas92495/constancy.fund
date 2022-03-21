import React from "react";
import getMeta from "~/_common/getMeta";

const AboutPage: React.FunctionComponent = () => (
  <>
    <h1>Constancy</h1>
    <h6>Crowdfunding for people and organisations that don’t want to sell equity.</h6>
    <p>Reach out to support@constancy.fund for any questions!</p>
  </>
);

export const meta = getMeta({ title: "About" });

export default AboutPage;
