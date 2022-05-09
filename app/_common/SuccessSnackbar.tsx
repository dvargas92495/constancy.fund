import { useEffect, useState } from "react";
import { useActionData } from "@remix-run/react";
import Toast from "./Toast";

const SuccessSnackbar = ({ message }: { message: string }) => {
  const actionData = useActionData();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (actionData?.success) {
      setIsOpen(true);
    }
  }, [actionData, setIsOpen]);
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
