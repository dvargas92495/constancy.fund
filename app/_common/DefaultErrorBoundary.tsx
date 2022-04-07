import type { ErrorBoundaryComponent } from "remix";

const DefaultErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: 24 }}>Application Error</h1>
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
    </main>
  );
};

export default DefaultErrorBoundary;
