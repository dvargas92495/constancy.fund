import styled from "styled-components";

const SectionTitle = styled.div<{ margin?: string }>`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 24px;
  font-weight: 800;
  margin: ${(props) => props.margin ? props.margin : '0 0 5px 0'};
`;

export default SectionTitle;
