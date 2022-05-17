import { Link } from "@remix-run/react";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

const UnknownSetupPage = () => {
  return (
    <>
      <p>
        Unknown fundraise setup type. Pick a valid option from our{" "}
        <Link to={"/user/fundraises/setup"}>setup</Link>
      </p>
    </>
  );
};

export default UnknownSetupPage;
