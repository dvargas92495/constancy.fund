import styled from "styled-components";

const Section = styled.div`
  background: ${(props) => props.theme.palette.color.white};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 50px;
  margin-bottom: 30px;
`;

export default Section;
