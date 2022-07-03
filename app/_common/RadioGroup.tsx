import { useState } from "react";
import styled from "styled-components";

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const RadioContainer = styled.div`
  border-radius: 50%;
  color: #73778b;
  width: 50%;
  padding: 0px;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  display: inline-flex;
`;

const RadioInput = styled.input`
  &:hover {
    background: none;
  }
  &:checked {
    border-style: solid;
    border-width: 1px;
    border-color: black;
  }
  width: 50%;
  padding: 0;
  cursor: inherit;
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  z-index: 1;
`;

type Option = { label: string; value: string; description: string };

const RadioGroup = ({
  options,
  name,
  onChange,
  defaultValue,
  renderItem,
}: {
  options: readonly Option[];
  name?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  renderItem: (
    args: {
      active: boolean;
    } & Option
  ) => React.ReactElement;
}) => {
  const [radioValue, setRadioValue] = useState(defaultValue);
  return (
    <RadioGroupContainer>
      {options.map((opt) => (
        <RadioContainer key={opt.value}>
          <RadioInput
            type={"radio"}
            name={name}
            key={opt.value}
            value={opt.value}
            required
            checked={radioValue === opt.value}
            onChange={(e) => {
              setRadioValue(e.target.value);
              onChange?.(e.target.value);
            }}
          />
          {renderItem({ active: opt.value === radioValue, ...opt })}
        </RadioContainer>
      ))}
    </RadioGroupContainer>
  );
};

export default RadioGroup;
