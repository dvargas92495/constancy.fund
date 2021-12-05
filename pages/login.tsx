import React from "react";
import { SignIn } from "@clerk/clerk-react";
import Layout, { LayoutHead } from "./_common/Layout";

const LoginPage: React.FC = () => (
  <Layout>
    <SignIn />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Log In"} />;
export default LoginPage;
