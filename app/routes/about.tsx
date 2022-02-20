import React from "react";
import getMeta from "~/_common/getMeta";
import About from "@dvargas92495/ui/dist/components/About";

const AboutPage: React.FunctionComponent = () => (
  <About title={"About"} subtitle={"Description"} paragraphs={[]} />
);

export const meta = getMeta({ title: "About" });

export default AboutPage;
