import React from "react";
import getMeta from "~/_common/getMeta";
import { SignUp } from "@clerk/remix";
import { LoaderFunction, redirect } from "remix";
import { getAuth } from "@clerk/remix/ssr.server";

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
  return getAuth(request).then((authData) => {
    if (!!authData.userId) {
      return redirect("/user");
    }
    return {};
  });
}

export const Head = getMeta({ title: "Sign up" });
export default Signup;
