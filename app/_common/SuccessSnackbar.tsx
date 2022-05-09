import { useEffect, useState } from "react";
import { useActionData, useFetcher } from "@remix-run/react";
import Toast from "./Toast";

const SuccessSnackbar = ({
  message,
  fetcher,
}: {
  message: string;
  fetcher?: ReturnType<typeof useFetcher>;
}) => {
  const actionData = useActionData();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (
      actionData?.success ||
      (fetcher?.data as { success?: boolean })?.success
    ) {
      setIsOpen(true);
    }
  }, [actionData, setIsOpen, fetcher]);
  return (
    <Toast
      open={isOpen}
      onClose={() => setIsOpen(false)}
      color="success"
      position="TOP_CENTER"
    >
      {message}
    </Toast>
  );
};

export default SuccessSnackbar;
