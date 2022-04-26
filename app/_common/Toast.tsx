import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import Icon from "./Icon";

type VERTICAL_POSITION = "TOP" | "BOTTOM";
type HORIZONTAL_POSITION = "LEFT" | "CENTER" | "RIGHT";

const ToastRoot = styled.div<{
  verticalPosition: VERTICAL_POSITION;
  horizontalPosition: HORIZONTAL_POSITION;
}>`
  z-index: 1400;
  position: fixed;
  display: flex;
  left: 24px;
  right: 24px;
  align-items: center;
  ${(props) =>
    props.verticalPosition === "BOTTOM" ? `bottom: 24px;` : `top: 24px;`}
  ${(props) =>
    props.horizontalPosition === "LEFT"
      ? `justify-content: left;`
      : props.horizontalPosition === "RIGHT"
      ? `justify-content: right;`
      : `justify-content: center;`}
`;

type Intent = "success" | "info" | "warning" | "danger";

const ToastContent = styled.div<{ color: Intent }>`
  box-shadow: 0px 4px 12px rgba(123, 94, 53, 0.23);
  padding: 12px;
  display: flex;
  flex-direction: column;
  width: 375px;
  border-radius: 4px;
  ${(props) =>
    props.color === "success"
      ? `border: 1px solid #06DF59;
        background-color: #A2FFB3;
        color: #324841;`
      : props.color === "warning"
      ? `border: 1px solid #DEAE6A;
      background-color: #FEE9CB;
      color: #493922`
      : props.color === "danger"
      ? `border: 1px solid #D97763;
      background-color: #F6DACD;
      color: #6B2115;`
      : `border: 1px solid darkblue;
      background-color: lightblue;
      color: darkblue;`}
`;

const ToastMain = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  margin-right: 12px;
`;

const MessageContainer = styled.div`
  flex-grow: 1;
`;

const Toast = ({
  open,
  onClose,
  children,
  position = "BOTTOM_LEFT",
  color = "info",
}: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  color?: Intent;
  position?: `${VERTICAL_POSITION}_${HORIZONTAL_POSITION}`;
}>) => {
  // original inspiration: https://github.com/mui-org/material-ui/blob/bf78a4a212cb328c951a9f3590a9518c72168f5c/packages/mui-material/src/Snackbar/Snackbar.js
  const autoHideDuration = 5000;
  const timerAutoHide = useRef(0);
  const nodeRef = useRef<HTMLDivElement>(null);

  const setAutoHideTimer = useCallback(
    (autoHideDurationParam) => {
      if (autoHideDurationParam == null) {
        return;
      }

      clearTimeout(timerAutoHide.current);
      timerAutoHide.current = window.setTimeout(onClose, autoHideDurationParam);
    },
    [onClose, timerAutoHide]
  );

  React.useEffect(() => {
    if (open) {
      setAutoHideTimer(autoHideDuration);
    }

    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, autoHideDuration, setAutoHideTimer]);

  // Pause the timer when the user is interacting with the Toast
  // or when the user hide the window.
  const handlePause = useCallback(() => {
    clearTimeout(timerAutoHide.current);
  }, [timerAutoHide]);

  // Restart the timer when the user is no longer interacting with the Toast
  // or when the window is shown back.
  const handleResume = useCallback(() => {
    if (autoHideDuration != null) {
      setAutoHideTimer(autoHideDuration * 0.5);
    }
  }, [autoHideDuration, setAutoHideTimer]);

  useEffect(() => {
    if (open) {
      window.addEventListener("focus", handleResume);
      window.addEventListener("blur", handlePause);

      return () => {
        window.removeEventListener("focus", handleResume);
        window.removeEventListener("blur", handlePause);
      };
    }
    return undefined;
  }, [handleResume, open]);

  const handleKeyDown = useCallback(
    (nativeEvent: KeyboardEvent) => {
      if (!nativeEvent.defaultPrevented) {
        if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
          onClose();
        }
      }
    },
    [onClose]
  );

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!nodeRef.current) {
        return;
      }
      const target = event.target as HTMLElement;
      const insideDOM = event.composedPath
        ? event.composedPath().indexOf(nodeRef.current) > -1
        : document.contains(target) || nodeRef.current.contains(target);

      if (!insideDOM) {
        onClose();
      }
    },
    [nodeRef, onClose]
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickAway);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickAway);
    };
  }, [open, handleKeyDown]);

  if (!open) {
    return null;
  }
  const [verticalPosition, horizontalPosition] = position.split("_") as [
    VERTICAL_POSITION,
    HORIZONTAL_POSITION
  ];

  return (
    <ToastRoot
      onBlur={handleResume}
      onFocus={handlePause}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      ref={nodeRef}
      verticalPosition={verticalPosition}
      horizontalPosition={horizontalPosition}
    >
      <ToastContent color={color}>
        <ToastMain>
          <IconContainer>
            <Icon name={color} heightAndWidth={'16px'} />
          </IconContainer>
          <MessageContainer>{children}</MessageContainer>
        </ToastMain>
      </ToastContent>
    </ToastRoot>
  );
};

export default Toast;
