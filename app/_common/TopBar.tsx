import styled from "styled-components";

const TopBar = styled.div<{left?: number}>`
  height: 100px;
  background: ${(props) => props.theme.palette.color.white};
  border-bottom: solid 1px ${(props) => props.theme.palette.color.lightgrey};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  position: fixed;
  z-index: 10;
  right: 0;
  left: ${(props) => props.left || 0}px;
`;

export default TopBar;
