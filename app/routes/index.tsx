import React, { useState } from "react";
import getMeta from "~/_common/getMeta";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { Handler } from "../../functions/convertkit/post";
import axios from 'axios';
import { Form, useNavigate } from "remix";
import MainImage from "~/_common/Images/runner.svg";
import { UserButton, useUser } from "@clerk/remix";

const LogoContainer = styled.img`
  position: absolute;
  top: 40px;
  left: 80px;
  height: 60px;
  width: 200px;
`;

const ButtonInnerDiv = styled.div`
  padding: 0 10px;
`;

const LoginButton = styled.a`
  padding: 10px 20px;
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

const MainContentContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
`;

const IntroBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15%;
`;

const BigTitle = styled.div`
  font-size: 40px;
  color: ${(props) => props.theme.palette.color.purple};
  font-weight: 800;
  line-height: 50px;
  margin-bottom: 15px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 300;
`;

const SignupBox = styled(Form)`
  margin-top: 30px;
  display: flex;
  align-items: center;
  grid-gap: 10px;
`;

const SignupFieldContainer = styled.input`
  border: 2px solid ${(props) => props.theme.palette.color.purple};
  font-weight: bold;
  text-transform: uppercase;
  height: 60px;
  width: 300px;
  text-align: center;
  border-radius: 8px;
  color: ${(props) => props.theme.palette.color.purple};

  &:focus::-webkit-input-placeholder {
    color: transparent;
  }

  &::placeholder {
    color: ${(props) => props.theme.palette.color.purple};
  }
`;

const MainImageContainer = styled.img`
  position: absolute;
  right: 0px;
  top: 25%;
  height: 60%;
`;

const Home: React.FC = () => {
  const { isSignedIn } = useUser();
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <LogoContainer src={"/svgs/constancy-logo.svg"} />
      <MainContentContainer>
        <IntroBox>
          <BigTitle>
            You don’t have to sell <br />
            your soul to get funded
          </BigTitle>
          <SubTitle>
            Crowdfunding for people and organisations that don’t want to sell
            equity.
          </SubTitle>
          <SignupBox>
            <SignupFieldContainer
              name="email"
              placeholder="Your Email"
            />
            <PrimaryAction
              height="60px"
              width="150px"
              label={<ButtonInnerDiv>JOIN ONBOARDING QUEUE</ButtonInnerDiv>}
              type={"submit"}
              fontWeight={"600"}
            />
            <Snackbar
              open={subscribed}
              autoHideDuration={5000}
              onClose={() => setSubscribed(false)}
              color="success"
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" sx={{ width: "100%" }}>
                {
                  "Thanks for signing up for our waitlist! Be sure to check your inbox to confirm the subscription"
                }
              </Alert>
            </Snackbar>
          </SignupBox>
        </IntroBox>
        <UserContainer>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <LoginButton onClick={() => navigate("/login")}>LOGIN</LoginButton>
          )}
        </UserContainer>
      </MainContentContainer>
      <MainImageContainer src={MainImage} />
    </>
  );
};

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const email = formData.get("email");
  if (!email) return new Response(400, 'Email is required');
  return axios
    .post<{ subscription: { subscriber: { id: string } } }>(
      `https://api.convertkit.com/v3/forms/${id}/subscribe`,
      {
        api_key: process.env.CONVERTKIT_API_KEY,
        email,
      }
    )
    .then(() => ({ success: true }));
}

export const meta = getMeta({ title: "Home" });

export default Home;
