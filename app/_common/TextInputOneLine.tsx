import React from "react";
import { useTransition } from "remix";
import styled from "styled-components";

const StyledInput = styled.input`
    outline: none;
    height: fill-available;
    width: fill-available;
    font-size: 14px;
    border: none;
    background: transparent;
    padding: 15px 10px;
    min-height: 30px;
    color: ${(props) => props.theme.palette.text.primary};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
    opacity: ${(props) => (props.disabled ? "0.5" : "1.0")};

    &::placeholder {
      color: #96a0b5;
    }
`;

const TextInputOneLine = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  const transition = useTransition();
  return (
    <StyledInput
      {...props}
      disabled={transition.state === "submitting" || props.disabled}
    />
  );
};

export default TextInputOneLine;
