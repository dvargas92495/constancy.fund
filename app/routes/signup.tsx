import React from "react";
import Layout, { getMeta } from "~/_common/Layout";
import { SignUp } from "@clerk/clerk-react";

const Signup: React.FunctionComponent = () => (
  <Layout>
    <SignUp />
  </Layout>
);

export const Head = getMeta({ title: "Sign up" });
export default Signup;
