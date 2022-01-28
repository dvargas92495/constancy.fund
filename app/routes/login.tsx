import React from "react";
import { SignIn } from "@clerk/clerk-react";
import Layout, { getMeta } from "~/_common/Layout";

const LoginPage: React.FC = () => (
  <Layout>
    <SignIn />
  </Layout>
);

export const meta = getMeta({ title: "Log in" });
export default LoginPage;
