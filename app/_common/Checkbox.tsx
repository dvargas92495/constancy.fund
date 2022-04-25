import { ChangeEventHandler } from "react";
import { useState } from "react";
import styled from "styled-components";

const CheckBoxContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  padding: 9px;
  border-radius: 50%;
  color: rgb(115, 119, 139);

  &:hover {
    background-color: rgba(52, 122, 226, 0.04);
  }
`;

const CheckboxInput = styled.input`
  cursor: inherit;
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  margin: 0px;
  padding: 0px;
  z-index: 1;
`;

const SVG = styled.svg`
  user-select: none;
  width: 1em;
  height: 1em;
  display: inline-block;
  fill: currentcolor;
  flex-shrink: 0;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-size: 1.5rem;
`;

const CheckBox = ({
  name,
  required,
  defaultChecked = false,
  onChange,
}: {
  name: string;
  required?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <CheckBoxContainer>
      <CheckboxInput
        name={name}
        required={required}
        type={"checkbox"}
        defaultChecked={defaultChecked}
        onChange={(e) => {
          setChecked(e.target.checked);
          onChange?.(e);
        }}
      />
      <SVG viewBox="0 0 24 24">
        {checked ? (
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        ) : (
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        )}
      </SVG>
    </CheckBoxContainer>
  );
};

export default CheckBox;
