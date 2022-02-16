import styled from "styled-components";

const SectionCircle = styled.div<{
  width?: string;
  height?: string;
  margin?: string;
}>`
  background: ${(props) =>
    props.theme.palette.color.backgroundColorDarkerDarker};
  border-radius: 100px;
  height: ${(props) =>
    props.width
      ? props.height
        ? props.height
        : props.width
      : "80px"} !important;
  width: ${(props) =>
    props.width
      ? props.width
        ? props.width
        : props.width
      : "80px"} !important;
  margin: ${(props) => (props.margin ? props.margin : "0 0 30px 0")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SectionCircle;
