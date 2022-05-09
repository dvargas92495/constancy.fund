import React from "react";
import getMeta from "~/_common/getMeta";
import { SignUp } from "@clerk/remix";
import { LoaderFunction, redirect } from "remix";

const Signup: React.FunctionComponent = () => (
  <>
    {process.env.NODE_ENV === "production" ? (
      <div>{"Signup page coming soon!"}</div>
    ) : (
      <SignUp />
    )}
  </>
);

export const loader: LoaderFunction = ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then((authData) => {
      if (authData.userId) {
        return redirect("/user");
      }
      return {};
    });
};

export const meta = getMeta({ title: "Sign up" });
export default Signup;
