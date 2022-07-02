import React from "react";
import { SignIn } from "@clerk/remix";
import getMeta from "~/_common/getMeta";
import { useSearchParams } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import styled from "styled-components";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <Container>
      {process.env.NODE_ENV === "production" && (
        <style>{`div.cl-component div.cl-auth-form-switch {
        display: none;
      }`}</style>
      )}
      <SignIn path="/login" redirectUrl={searchParams.get("redirect")} />
    </Container>
  );
};

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

export const meta = getMeta({ title: "Log in" });
export default LoginPage;
