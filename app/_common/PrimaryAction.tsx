import React from "react";
import { useActionData, useTransition } from "@remix-run/react";
import styled from "styled-components";
import { LoadingIndicator } from "./LoadingIndicator";

const StyledPrimaryAction = styled.button<{
  height?: string | number;
  width?: string | number;
  disabled?: boolean;
  autoFocus?: boolean;
  bgColor?: string;
}>`
  padding: 8px 20px;
  border-color: unset;
  border-width: unset;
  border-style: unset;
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
      : props.bgColor
      ? props.theme.palette.color[props.bgColor]
      : props.theme.palette.color.purple};
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;

  & * {
    display: flex;
  }

  :focus {
    outline: unset;
  }

  &: hover {
    opacity: 0.8;
  }
`;

const StyledPrimaryActionLinkText = styled.div<{
  fontSize?: string;
  disabled?: boolean;
  textColor?: string;
  fontWeight?: string;
}>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  color: ${(props) =>
    props.disabled
      ? props.theme.palette.color.lighterText
      : props.textColor
      ? props.textColor
      : "white"};
  font-weight: ${(props) => props.fontWeight};
`;
export const PrimaryAction = ({
  label,
  onClick,
  disabled: _disabled,
  innerRef,
  fontSize,
  isLoading,
  height,
  width,
  bgColor,
  textColor,
  fontWeight,
  type = "button",
  id,
}: {
  label: React.ReactNode;
  onClick?: React.EventHandler<React.KeyboardEvent | React.MouseEvent>;
  disabled?: boolean;
  innerRef?: React.RefObject<HTMLButtonElement>;
  fontSize?: string;
  isLoading?: boolean;
  height?: string;
  width?: string;
  bgColor?: string;
  textColor?: string;
  fontWeight?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  id?: string;
}) => {
  const actionData = useActionData();
  const transition = useTransition();
  const loading = transition.state !== "idle" || isLoading;
  const disabled = _disabled || loading;
  return (
    <StyledPrimaryAction
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      ref={innerRef}
      onKeyPress={(e) => (e.key === "Enter" ? onClick?.(e) : false)}
      height={height}
      width={width}
      bgColor={actionData?.error ? "warning" : bgColor}
      type={type}
      id={id}
    >
      {loading ? (
        <LoadingIndicator size="20px" thickness={3} />
      ) : (
        <StyledPrimaryActionLinkText
          fontWeight={fontWeight}
          textColor={textColor}
          disabled={disabled}
          fontSize={fontSize}
        >
          {label}
        </StyledPrimaryActionLinkText>
      )}
    </StyledPrimaryAction>
  );
};
