import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import ConvertKit from "@dvargas92495/ui/dist/components/ConvertKit";

const Home: React.FC = () => (
  <Layout>
    <ConvertKit id={"eb07e20bc3"} />
  </Layout>
);

export const Head = () => <LayoutHead title={"Home"} />;

export default Home;
