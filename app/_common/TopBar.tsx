import styled from "styled-components";

const TopBar = styled.div`
  height: 100px;
  background: ${(props) => props.theme.palette.color.white};
  border-bottom: solid 1px ${(props) => props.theme.palette.color.lightgrey};
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  position: fixed;
  z-index: 10;
`;

export default TopBar;
