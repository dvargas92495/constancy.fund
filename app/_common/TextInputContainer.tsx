import styled from "styled-components";

const TextInputContainer = styled.div<{ width?: string }>`
  display: flex;
  grid-auto-flow: column;
  grid-gap: 10px;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  height: 50px;
  border-radius: 8px;
  max-width: ${(props) => (props.width ? props.width : "350px")};
  width: ${(props) => (props.width ? props.width : "fill-available")};
  height: fit-content;
  & > div {
    font-size: 14px;
    width: 100%;
    position: relative;
  }
`;

export default TextInputContainer;
