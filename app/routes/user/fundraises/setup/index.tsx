import FUNDRAISE_TYPES from "~/enums/fundraiseTypes";
import { useNavigate } from "remix";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import Section from "~/_common/Section";
import InfoText from "~/_common/InfoText";
import SubSectionTitle from "~/_common/SubSectionTitle";
import { useDashboardActions } from "~/_common/DashboardActionContext";
import { useEffect } from "react";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";

const FundraisingTypeTopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 16px;
`;
const FundraisingTypeTitleSubTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  grid-gap: 5px;
`;

const FundraisingTypeCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  grid-gap: 20px;
`;

const FundraisingTypeHelpBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 10px;
  color: ${(props) => props.theme.palette.color.purple};
`;

const UserFundraisesSetup = () => {
  const navigate = useNavigate();
  const { setShowSecondary, setShowPrimary } = useDashboardActions();
  useEffect(() => {
    setShowSecondary(false);
    setShowPrimary(false);
  }, [setShowSecondary, setShowPrimary]);
  return (
    <>
      {FUNDRAISE_TYPES.map(({ name, description, help, enabled, id }) => (
        <Section key={id}>
          <FundraisingTypeCard>
            <FundraisingTypeTopRow>
              <FundraisingTypeTitleSubTitleContainer>
                <SubSectionTitle margin={"0 0 5px 0"}>{name}</SubSectionTitle>
                <InfoText>{description}</InfoText>
              </FundraisingTypeTitleSubTitleContainer>
              <PrimaryAction
                label={enabled ? "Select" : "Coming Soon"}
                disabled={enabled ? false : true}
                onClick={() => navigate(`/user/fundraises/setup/${id}`)}
              />
            </FundraisingTypeTopRow>
            <FundraisingTypeHelpBox>
              <Icon
                name={"thumbsUp"}
                color={"purple"}
                heightAndWidth={"20px"}
              />
              {help}
            </FundraisingTypeHelpBox>
          </FundraisingTypeCard>
        </Section>
      ))}
    </>
  );
};

export const handle = {
  title: "Choose your fundraising type",
};

export default UserFundraisesSetup;
