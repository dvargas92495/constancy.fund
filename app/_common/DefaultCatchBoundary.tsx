import DefaultErrorBoundary from "./DefaultErrorBoundary";
import { CatchBoundaryComponent } from "@remix-run/server-runtime/routeModules";
import { useCatch } from "@remix-run/react";

const DefaultCatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  const error = new Error(
    typeof caught.data === "object" ? JSON.stringify(caught.data) : caught.data
  );
  error.name = `CAUGHT ${error.name}`;
  return <DefaultErrorBoundary error={error} />;
};

export default DefaultCatchBoundary;
