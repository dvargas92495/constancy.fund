import React from "react";
import Layout, { getMeta } from "~/_common/Layout";
import ConvertKit from "@dvargas92495/ui/dist/components/ConvertKit";
import styled from "styled-components";
import MainImage = require("~/_common/Images/runner.svg")
import { PrimaryAction } from "~/_common/PrimaryAction";


function change() {
  const ab = document.getElementById('ghd').value = "";
  console.log(ab)
}

const Home: React.FC = () => (
  <Layout>
    {/* <ConvertKit id={"eb07e20bc3"} /> */}
    <MainContentContainer>
      <IntroBox>
        <BigTitle>
          You don’t have to sell <br />your soul to get funded
        </BigTitle>
        <SubTitle>
          Crowdfunding for people and organisations that don’t want to sell equity.
        </SubTitle>
        <SignupBox>
          <SignupFieldContainer
            placeholder="Your Email"
            id="ghd"
            onClick={() => change()}
          />
          <PrimaryAction
            height='60px'
            width='150px'
            label={<ButtonInnerDiv>JOIN ONBOARDING QUEUE</ButtonInnerDiv>}
            onClick={null}
            fontWeight={'600'}
          />
        </SignupBox>
      </IntroBox>
      <LoginButton>
        LOGIN
      </LoginButton>
    </MainContentContainer>
    <MainImageContainer
      src={MainImage}
    />
  </Layout>
);

export const meta = getMeta({ title: "Home" });

export default Home;

const ButtonInnerDiv = styled.div`
  padding: 0 10px;
`

const LoginButton = styled.div`
  color: ${props => props.theme.palette.color.purple};
  font-size: 18px;
  font-weight: 800;
  position: absolute;
  right: 30px;
  top: 30px;
  cursor: pointer;
  padding: 10px 20px;
`

const MainContentContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
`

const IntroBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15%;
`

const BigTitle = styled.div`
  font-size: 40px;
  color: ${props => props.theme.palette.color.purple};
  font-weight: 800;
  line-height: 50px;
  margin-bottom: 15px;
`

const SubTitle = styled.div`
   font-size: 18px;
    color: ${props => props.theme.palette.text.secondary};
    font-weight: 300;
`

const SignupBox = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  grid-gap: 10px;
`

const SignupFieldContainer = styled.input`
  border: 2px solid ${props => props.theme.palette.color.purple};
  font-weight: bold;
  text-transform: uppercase;
  height: 60px;
  width: 300px;
  text-align: center;
  border-radius: 8px;
  color: ${props => props.theme.palette.color.purple};

  &:focus::-webkit-input-placeholder {
    color: transparent;
}

  &::placeholder {
    color: ${props => props.theme.palette.color.purple};
  }
`

const MainImageContainer = styled.img`
  position: absolute;
  right: 0px;
  top: 25%;
`

