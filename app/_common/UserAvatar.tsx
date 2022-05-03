import { UserButton, useUser } from "@clerk/remix";
import styled from "styled-components";
import { useLocation } from "@remix-run/react";

const LoginButton = styled.a`
  padding: 10px 20px;
  text-decoration: none;
  &:active,
  &:visited,
  &:hover {
    color: inherit;
  }
`;

const UserContainer = styled.div`
  color: ${(props) => props.theme.palette.color.purple};
  font-size: 18px;
  font-weight: 800;
  position: absolute;
  right: 50px;
  top: 40px;
  cursor: pointer;
`;

const UserAvatar = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();
  return (
    <UserContainer id={"user-container"}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div>
          <LoginButton
            href={`/login${
              location.pathname === "/" ? "" : `?redirect=${location.pathname}`
            }`}
          >
            LOGIN
          </LoginButton>
        </div>
      )}
    </UserContainer>
  );
};

export default UserAvatar;
