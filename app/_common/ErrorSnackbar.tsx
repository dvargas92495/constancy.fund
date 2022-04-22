import { useEffect, useState } from "react";
import { useActionData } from "@remix-run/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ErrorSnackbar = () => {
  const actionData = useActionData();
  const [error, setError] = useState("");
  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData, setError]);
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={5000}
      onClose={() => setError("")}
    >
      <Alert severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
