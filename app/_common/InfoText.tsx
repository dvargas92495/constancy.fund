import styled from "styled-components";

const InfoText = styled.div<{ margin?: string }>`
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 16px;
  margin: ${(props) => props.margin ? props.margin : '0 0 40px 0'};
  font-weight: 500;
  line-height: 26px;
`;

export default InfoText;
