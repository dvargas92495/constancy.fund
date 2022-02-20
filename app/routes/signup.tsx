import React from "react";
import getMeta from "~/_common/getMeta";
import { SignUp } from "@clerk/remix";

const Signup: React.FunctionComponent = () => (
  <>
    {process.env.NODE_ENV === "production" ? (
      <div>{"Signup page coming soon!"}</div>
    ) : (
      <SignUp />
    )}
  </>
);

export const Head = getMeta({ title: "Sign up" });
export default Signup;
