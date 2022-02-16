import styled from "styled-components";

const SubSectionTitle = styled.div<{ margin?: string }>`
  font-weight: bold;
  font-size: 20px;
  color: ${(props) => props.theme.palette.color.darkerText};
  margin: ${(props) => (props.margin ? props.margin : "0 0 20px 0")};
`;

export default SubSectionTitle;
