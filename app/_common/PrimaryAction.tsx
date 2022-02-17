import React from "react";
import styled from "styled-components";
import getStaticProps from "~/creator.server";
import { LoadingIndicator } from "./LoadingIndicator";

const StyledPrimaryAction = styled.div<{
    height?: string | number;
    width?: string | number;
    disabled?: boolean;
    autoFocus?: boolean;
    bgColor?: string
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
            ? props.theme.palette.color.backgroundColorDarker : (props.bgColor ? props.theme.palette.color[props.bgColor]
                : props.theme.palette.color.purple)};
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
    fontSize?: string,
    disabled?: boolean
    textColor?: string
}>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  color: ${(props) => (props.disabled ? props.theme.palette.color.lighterText : (props.textColor ? props.textColor : "white"))};
`;
export const PrimaryAction = ({
    label,
    onClick,
    disabled,
    innerRef,
    fontSize,
    isLoading,
    height,
    width,
    bgColor,
    textColor,
}: {
    label: React.ReactNode;
    onClick: React.EventHandler<React.KeyboardEvent | React.MouseEvent>;
    disabled?: boolean;
    innerRef?: any;
    fontSize?: string;
    isLoading?: boolean;
    height?: string;
    width?: string;
    bgColor?: string;
    textColor?: string;
}) => (
    <StyledPrimaryAction
        autoFocus
        tabIndex={0}
        onClick={disabled === true ? undefined : onClick}
        disabled={disabled}
        ref={innerRef}
        onKeyPress={(e) => (e.key === "Enter" ? onClick(e) : false)}
        height={height}
        width={width}
        bgColor={bgColor}
    >
        {isLoading ? (
            <LoadingIndicator size="20px" thickness={3} />
        ) : (
            <StyledPrimaryActionLinkText textColor={textColor} disabled={disabled} fontSize={fontSize}>
                {label}
            </StyledPrimaryActionLinkText>
        )}
    </StyledPrimaryAction>
);
