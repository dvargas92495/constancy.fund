import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useDashboardActions } from "~/_common/DashboardActionContext";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

const UnknownSetupPage = () => {
  const { setShowPrimary, setShowSecondary } = useDashboardActions();
  useEffect(() => {
    setShowSecondary(true);
  }, [setShowPrimary, setShowSecondary]);
  return (
    <>
      <p>
        Unknown fundraise setup type. Pick a valid option from our{" "}
        <Link to={"/user/fundraises/setup"}>setup</Link>
      </p>
    </>
  );
};

export const handle = {
  title: "Unknown Fundraise Type",
  secondaryLabel: "Back",
  onSecondary: () => window.location.assign("/user/fundraises"),
};

export default UnknownSetupPage;
