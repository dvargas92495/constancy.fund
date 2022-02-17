import styled from "styled-components";

const Spacer = styled.div<{ height: string }>`
  height: ${props => props.height};
`;

export default Spacer;
