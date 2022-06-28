import { useTransition } from "@remix-run/react";
import React from "react";
import styled from "styled-components";
import { LoadingIndicator } from "./LoadingIndicator";

const StyledSecondaryActionLinkText = styled.div<{
  fontSize?: string;
}>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  color: ${(props) => props.theme.palette.color.purple};
`;

const StyledSecondaryAction = styled.div<{
  height?: number | string;
  width?: number | string;
  disabled?: boolean;
  autoFocus: boolean;
}>`
  padding: 8px 20px;
  height: ${(props) => (props.height ? props.height : "35px")};
  font-weight: normal;
  overflow: visible;
  white-space: nowrap;
  display: flex;
  min-width: fit-content;
  width: ${(props) => (props.width ? props.width : "80px")};
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  background: ${(props) =>
    props.disabled
      ? props.theme.palette.color.backgroundColorDarker
      : props.theme.palette.color.white};
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.palette.color.purple};
  cursor: pointer;

  & * {
    display: flex;
  }

  :focus {
    outline: unset;
  }

  &: hover {
    background: ${(props) => props.theme.palette.color.purple}10;
    color: white;

    & ${StyledSecondaryActionLinkText} {
    }
  }
`;

export const SecondaryAction = ({
  label,
  onClick,
  disabled: _disabled,
  innerRef,
  fontSize,
  isLoading,
  height,
  width,
  id,
}: {
  label: React.ReactNode;
  onClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  disabled?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  fontSize?: string;
  isLoading?: boolean;
  height?: string;
  width?: string;
  id?: string;
}) => {
  const transition = useTransition();
  const loading = isLoading || transition.state !== "idle";
  const disabled = _disabled || loading;
  return (
    <StyledSecondaryAction
      autoFocus
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      ref={innerRef}
      onKeyPress={(e) => (e.key === "Enter" ? onClick(e) : false)}
      height={height}
      width={width}
      id={id}
    >
      {loading ? (
        <LoadingIndicator size="20px" thickness={3} />
      ) : (
        <StyledSecondaryActionLinkText fontSize={fontSize}>
          {label}
        </StyledSecondaryActionLinkText>
      )}
    </StyledSecondaryAction>
  );
};
