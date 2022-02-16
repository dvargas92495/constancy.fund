import styled from "styled-components";

const TextInputMultiLine = styled.textarea`
  outline: none;
  height: fill-available;
  width: fill-available;
  color: #96a0b5;
  font-size: 14px;
  border: none;
  padding: 15px 15px;
  min-height: 150px;
  background: transparent;
  &::placeholder {
    color: #96a0b5;
  }
`;

export default TextInputMultiLine;
