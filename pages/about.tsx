import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import About from "@dvargas92495/ui/dist/components/About";

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <About
      title={"About"}
      subtitle={"Description"}
      paragraphs={[]}
    />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"About"} />;
export default AboutPage;
