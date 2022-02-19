import React from "react";
import Layout, { getMeta } from "~/_common/Layout";
import { SignUp } from "@clerk/clerk-react";

const Signup: React.FunctionComponent = () => (
  <Layout>
    {process.env.NODE_ENV === "production" ? (
      <div>{"Signup page coming soon!"}</div>
    ) : (
      <SignUp />
    )}
  </Layout>
);

export const Head = getMeta({ title: "Sign up" });
export default Signup;
