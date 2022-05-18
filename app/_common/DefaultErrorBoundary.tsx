import { useMatches } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";

const DefaultErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  const matches = useMatches();
  const logUrl = matches[0].data.logUrl;
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: 24 }}>{error.name}</h1>
      <h3 style={{ fontSize: 18 }}>
        Please email support@constancy.fund for assistance
      </h3>
      <pre
        style={{
          padding: "2rem",
          background: "rgba(191, 85, 64, 0.1)",
          color: "red",
          overflow: "auto",
        }}
      >
        {error.stack}
      </pre>
      {logUrl && (
        <p>
          Check out the rest of the logs on{" "}
          <a
            href={logUrl}
            target={"_blank"}
            rel={"noreferrer"}
            className={
              "text-sky-800 underline hover:no-underline active:text-sky-900"
            }
          >
            AWS
          </a>
          .
        </p>
      )}
    </main>
  );
};

export default DefaultErrorBoundary;
