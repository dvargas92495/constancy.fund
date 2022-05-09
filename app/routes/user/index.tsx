import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import getUserProfile from "~/data/getUserProfile.server";
import saveUserProfile from "~/data/saveUserProfile.server";
import CountrySelect from "~/_common/CountrySelect";
import PaymentPreferences from "~/_common/PaymentPreferences";
import QUESTIONAIRES from "~/_common/questionaires";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { SecondaryAction } from "~/_common/SecondaryAction";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
import TopBar from "~/_common/TopBar";
import InfoArea from "~/_common/InfoArea";
import PageTitle from "~/_common/PageTitle";
import ActionButton from "~/_common/ActionButton";
import ContentContainer from "~/_common/ContentContainer";
import Section from "~/_common/Section";
import SectionCircle from "~/_common/SectionCircle";
import SectionTitle from "~/_common/SectionTitle";
import InfoText from "~/_common/InfoText";
import TextFieldBox from "~/_common/TextFieldBox";
import TextFieldDescription from "~/_common/TextFieldDescription";
import SubSectionTitle from "~/_common/SubSectionTitle";
import TextInputMultiLine from "~/_common/TextInputMultiLine";
import ErrorSnackbar from "~/_common/ErrorSnackbar";
import ImageUploader from "~/_common/ImageUploader";
import { ClerkCatchBoundary, useUser } from "@clerk/remix";
import DefaultErrorBoundary from "~/_common/DefaultErrorBoundary";
import Toast from "~/_common/Toast";

const SubSection = styled.div`
  margin-top: 60px;
`;

const AddressBox = styled.div``;

const NameAreaBox = styled.div``;

const AddressArea = styled.div`
  display: flex;
  align-items: flex-end;
  grid-gap: 5px;
  width: fill-available;
`;

const QuestionaireBox = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
`;

const NameandProfileImageSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  grid-gap: 30px;
  padding-right: 40px;
`;

const ProfileImageContainer = styled.div`
  width: 200px;
  height: 200px;
  min-width: 200px;
  position: relative;
`;

const ProfileImageChangeOverlay = styled.div`
  background: white;
  border-radius: 60px;
  height: 50px;
  width: 50px;
  z-index: 9;
  margin: 30px;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  display: none;

  &:hover {
    background: red;
    display: flex;
  }
`;

const ProfileImageBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid ${(props) => props.theme.palette.color.lightgrey};
  border-radius: 300px;
  margin: 1px;
  background: white;
  cursor: pointer;

  &:hover {
    ${ProfileImageChangeOverlay} {
      display: flex;
    }
  }

  & > * {
    height: fill-available;
    width: fill-available;
    object-fit: contain;
  }
`;

const SocialProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 15px;
  align-items: center;
  justify-content: flex-start;
`;

const UserProfileForm = styled(Form)``;

const SOCIAL_PROFILES = [
  { iconName: "twitter" },
  { iconName: "github" },
  { iconName: "linkedIn" },
  { iconName: "public" },
] as const;

const SocialProfile = React.memo(
  ({
    iconName,
    defaultValue = "",
  }: {
    iconName: typeof SOCIAL_PROFILES[number]["iconName"];
    defaultValue: string;
  }) => (
    <SocialProfileRow>
      <Icon name={iconName} heightAndWidth="20px" color="purple" />
      <TextInputContainer>
        <TextInputOneLine
          placeholder="https://"
          defaultValue={defaultValue}
          name={"socialProfiles"}
          pattern="https://.*"
          title="URL must begin with https:// protocol"
        />
      </TextInputContainer>
    </SocialProfileRow>
  )
);

const UserProfile = () => {
  const loaderData =
    useLoaderData<Awaited<ReturnType<typeof getUserProfile>>>();
  const actionData = useActionData();

  const {
    id,
    completed,
    firstName,
    lastName,
    companyName,
    contactEmail,
    socialProfiles,
    questionaires,
    attachDeck,
    demoVideo,
    registeredCountry,
    companyRegistrationNumber,
    companyAddressStreet,
    companyAddressNumber,
    companyAddressCity,
    companyAddressZip,
    representativeAddressStreet,
    representativeAddressNumber,
    representativeAddressCity,
    representativeAddressZip,
    paymentPreferences,
  } = loaderData;
  const [isChanges, setIsChanges] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const changes = useRef(new Set<HTMLElement>());
  const { user } = useUser();
  const saveImage = useCallback(
    (file: File) => {
      return user!.setProfileImage({ file });
    },
    [user]
  );
  useEffect(() => {
    if (actionData?.success) {
      setSnackbarOpen(true);
      changes.current.clear();
      setIsChanges(false);
    }
  }, [setSnackbarOpen, actionData, setIsChanges, changes.current]);
  return (
    <UserProfileForm
      method="put"
      onChange={(e) => {
        const el = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (el.value === el.defaultValue) {
          changes.current.delete(el);
        } else {
          changes.current.add(el);
        }
        if (changes.current.size && !isChanges) {
          setIsChanges(true);
        } else if (!changes.current.size && isChanges) {
          setIsChanges(false);
        }
      }}
    >
      <TopBar>
        <InfoArea>
          <PageTitle>Your Profile</PageTitle>
          <ActionButton>
            {completed && (
              <SecondaryAction
                onClick={() => window.open(`/creator/${id}`)}
                label={"View Public Profile"}
                height={"40px"}
                width={"180px"}
                fontSize={"16px"}
                id={"view-public-profile"}
              />
            )}
            {isChanges && (
              <PrimaryAction
                disabled={!isChanges}
                label={"Save Edits"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
                type={"submit"}
              />
            )}
          </ActionButton>
        </InfoArea>
        {/* <UserButton /> */}
      </TopBar>
      <ContentContainer>
        <Section>
          <SectionCircle>
            <Icon name={"personFine"} heightAndWidth="24px" color="purple" />
          </SectionCircle>
          <SectionTitle>Your fundraising Profile</SectionTitle>
          <InfoText>This is what investors will see first</InfoText>
          <NameandProfileImageSection>
            <NameAreaBox>
              <TextFieldBox>
                <TextFieldDescription required>
                  Name of your company or research project.
                </TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    name={"companyName"}
                    required
                    defaultValue={companyName}
                  />
                </TextInputContainer>
              </TextFieldBox>
            </NameAreaBox>
            <ProfileImageContainer>
              <ProfileImageBox>
                <ImageUploader
                  title="Upload photo"
                  subtitle="Select a profile photo"
                  handleSuccess={saveImage}
                >
                  <img
                    src={user?.profileImageUrl}
                    width={'100%'}
                    height={'100%'}
                  />
                </ImageUploader>
              </ProfileImageBox>
              <ProfileImageChangeOverlay>
                <Icon name={"dollar"} heightAndWidth="24px" color="purple" />
              </ProfileImageChangeOverlay>
            </ProfileImageContainer>
          </NameandProfileImageSection>
          <SubSection>
            <SubSectionTitle>Why should people invest in you?</SubSectionTitle>
            <QuestionaireBox>
              {QUESTIONAIRES.map(({ q }, i) => (
                <TextFieldBox key={i}>
                  <TextFieldDescription required>{q}</TextFieldDescription>
                  <TextInputContainer width={"600px"}>
                    <TextInputMultiLine
                      key={i}
                      name={"questionaires"}
                      required
                      defaultValue={questionaires[i]}
                    />
                  </TextInputContainer>
                </TextFieldBox>
              ))}
            </QuestionaireBox>
          </SubSection>
          <SubSection>
            <SubSectionTitle>How can people find you?</SubSectionTitle>
            <QuestionaireBox>
              {SOCIAL_PROFILES.map(({ iconName }, i) => (
                <SocialProfile
                  key={i}
                  iconName={iconName}
                  defaultValue={socialProfiles[i]}
                />
              ))}
            </QuestionaireBox>
          </SubSection>
          <SubSection>
            <SubSectionTitle>
              <Icon name={"youtube"} heightAndWidth="20px" color="purple" />
              Attach a demo video
            </SubSectionTitle>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                defaultValue={demoVideo}
                placeholder="https://"
                name={"demoVideo"}
              />
            </TextInputContainer>
          </SubSection>
          <SubSection>
            <SubSectionTitle>
              <Icon name={"monitor"} heightAndWidth="20px" color="purple" />
              Attach a slide deck
            </SubSectionTitle>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                defaultValue={attachDeck}
                placeholder="https://"
                name={"attachDeck"}
              />
            </TextInputContainer>
          </SubSection>
        </Section>

        <Section>
          <SectionCircle>
            <Icon name={"dollar"} heightAndWidth="24px" color="purple" />
          </SectionCircle>
          <PaymentPreferences defaultValue={paymentPreferences} />
        </Section>

        <Section>
          <SectionCircle>
            <Icon name={"book"} heightAndWidth="24px" color="purple" />
          </SectionCircle>
          <SectionTitle>Legal Information</SectionTitle>
          <InfoText>
            You must have a registered company to be able to use this service.
            If you do not, there are fast ways to open up a company.{" "}
            <a
              href={"https://stripe.com/atlas"}
              target={"_blank"}
              rel="noreferrer"
            >
              Learn More.
            </a>
          </InfoText>
          <div>
            <TextFieldBox>
              <TextFieldDescription required>
                Registered Country
              </TextFieldDescription>
              <TextInputContainer>
                <CountrySelect
                  defaultValue={registeredCountry}
                  name={"registeredCountry"}
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription required>
                Registration Number
              </TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  defaultValue={companyRegistrationNumber}
                  required
                  name={"companyRegistrationNumber"}
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldDescription required>Address</TextFieldDescription>
            <AddressArea>
              <AddressBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    Street
                  </TextFieldDescription>
                  <TextInputContainer width={"300px"}>
                    <TextInputOneLine
                      defaultValue={companyAddressStreet}
                      required
                      name={"companyAddressStreet"}
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    City
                  </TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      defaultValue={companyAddressCity}
                      required
                      name={"companyAddressCity"}
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </AddressBox>
              <AddressBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    Nr.
                  </TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      defaultValue={companyAddressNumber}
                      required
                      name={"companyAddressNumber"}
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    ZIP
                  </TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      defaultValue={companyAddressZip}
                      required
                      name={"companyAddressZip"}
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </AddressBox>
            </AddressArea>

            <SubSection>
              <SubSectionTitle>Legal Representative</SubSectionTitle>
              <InfoText>
                The person who is authorized to raise funds on behalf of the
                company.
              </InfoText>
              <TextFieldBox>
                <TextFieldDescription required>First Name</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    name={"firstName"}
                    required
                    defaultValue={firstName}
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription required>Last Name</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    name={"lastName"}
                    required
                    defaultValue={lastName}
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription required>
                  Contact Email
                </TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    defaultValue={contactEmail}
                    required
                    name={"contactEmail"}
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldDescription required>Address</TextFieldDescription>
              <AddressArea>
                <AddressBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      Street
                    </TextFieldDescription>
                    <TextInputContainer width={"300px"}>
                      <TextInputOneLine
                        defaultValue={representativeAddressStreet}
                        required
                        name={"representativeAddressStreet"}
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      City
                    </TextFieldDescription>
                    <TextInputContainer>
                      <TextInputOneLine
                        defaultValue={representativeAddressCity}
                        required
                        name={"representativeAddressCity"}
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                </AddressBox>
                <AddressBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      Nr.
                    </TextFieldDescription>
                    <TextInputContainer>
                      <TextInputOneLine
                        defaultValue={representativeAddressNumber}
                        required
                        name={"representativeAddressNumber"}
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      ZIP
                    </TextFieldDescription>
                    <TextInputContainer>
                      <TextInputOneLine
                        defaultValue={representativeAddressZip}
                        required
                        name={"representativeAddressZip"}
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                </AddressBox>
              </AddressArea>
            </SubSection>
          </div>
        </Section>
      </ContentContainer>
      <Toast open={snackbarOpen} onClose={() => setSnackbarOpen(false)}>
        <span id={"success-profile-alert"}>Successfully Saved Profile!</span>
      </Toast>
      <ErrorSnackbar />
    </UserProfileForm>
  );
};

export const loader = async ({ request }: Parameters<LoaderFunction>[0]) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        throw new Response(
          "Cannot access private page while not authenticated",
          {
            status: 401,
          }
        );
      }
      return getUserProfile(userId);
    });
};

export const action: ActionFunction = ({ request }) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        throw new Response(
          "Cannot access private page while not authenticated",
          { status: 401 }
        );
      }
      const formData = await request.formData();
      const data = Object.fromEntries(
        Array.from(formData.keys()).map((k) => [
          k,
          formData.getAll(k).map((v) => v as string),
        ])
      );
      return saveUserProfile(userId, data).then(() => ({ success: true }));
    })
    .catch((e) => ({ success: false, error: e.message }));
};

export const CatchBoundary = ClerkCatchBoundary(() => {
  const { data } = useCatch();
  return <div>{data}</div>;
});

export const ErrorBoundary = DefaultErrorBoundary;

export default UserProfile;
