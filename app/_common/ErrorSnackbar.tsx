import { useEffect, useState } from "react";
import { useActionData } from "@remix-run/react";
import Toast from "./Toast";

const ErrorSnackbar = () => {
  const actionData = useActionData();
  const [error, setError] = useState("");
  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData, setError]);
  return (
    <Toast open={!!error} onClose={() => setError("")} color="danger">
      {error}
    </Toast>
  );
};

export default ErrorSnackbar;
