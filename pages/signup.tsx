import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import { SignUp } from "@clerk/clerk-react";

const Signup: React.FunctionComponent = () => (
  <Layout>
    <SignUp />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Sign up"} />;
export default Signup;
