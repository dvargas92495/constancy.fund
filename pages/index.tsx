import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";

const Home: React.FC = () => <Layout>Welcome!</Layout>;

export const Head = () => <LayoutHead title={"Home"} />;

export default Home;
