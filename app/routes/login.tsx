import React from "react";
import { SignIn } from "@clerk/remix";
import getMeta from "~/_common/getMeta";

const LoginPage: React.FC = () => (
  <>
    {process.env.NODE_ENV === "production" && (
      <style>{`div.cl-component div.cl-auth-form-switch {
        display: none;
      }`}</style>
    )}
    <SignIn path="/login" routing="path" />
  </>
);

export const meta = getMeta({ title: "Log in" });
export default LoginPage;
