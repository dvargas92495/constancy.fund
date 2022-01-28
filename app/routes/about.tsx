import React from "react";
import Layout, { getMeta } from "../_common/Layout";
import About from "@dvargas92495/ui/dist/components/About";

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <About title={"About"} subtitle={"Description"} paragraphs={[]} />
  </Layout>
);

export const meta = getMeta({ title: "About" });

export default AboutPage;
