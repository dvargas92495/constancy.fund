import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import getUserProfile from "~/data/getUserProfile.server";
import saveUserProfile from "~/data/saveUserProfile.server";
import CountrySelect from "~/_common/CountrySelect";
import PaymentPreferences from "~/_common/PaymentPreferences";
import QUESTIONAIRES from "~/_common/questionaires";
import Icon, { IconName } from "~/_common/Icon";
import styled from "styled-components";
import TextInputContainer from "~/_common/TextInputContainer";
import TextInputOneLine from "~/_common/TextInputOneLine";
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
import { useUser } from "@clerk/remix";
export { default as ErrorBoundary } from "~/_common/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/_common/DefaultCatchBoundary";
import Toast from "~/_common/Toast";
import RadioGroup from "~/_common/RadioGroup";
import { useDashboardActions } from "~/_common/DashboardActionContext";

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

const ProfileTypeContainer = styled.div<{ active: boolean }>`
  padding: 8px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme};
  border: ${(props) =>
    props.active
      ? "1px solid" + props.theme.palette.color.purple
      : "1px solid" + props.theme.palette.color.lightgrey};
  color: ${(props) =>
    props.active
      ? props.theme.palette.color.purple
      : props.theme.palette.color.darkGrey};
`;

const ProfileTypeLabel = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 8px 0px;
`;

const ProfileTypeDescription = styled.h2`
  font-size: 12px;
  font-weight: 600;
  opacity: 0.75;
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

const ProfileCard: React.FC<{ iconName: IconName }> = ({
  children,
  iconName,
}) => (
  <Section>
    <SectionCircle>
      <Icon name={iconName} heightAndWidth="24px" color="purple" />
    </SectionCircle>
    {children}
  </Section>
);

const USER_PROFILE_TYPES = [
  {
    label: "Creator",
    description: "Raise money from investors to fund your endeavors",
    value: "creator",
  },
  {
    label: "Investor",
    description: "Invest in other creators and build out your portfolio",
    value: "investor",
  },
] as const;

type LoaderData = Awaited<ReturnType<typeof getUserProfile>>;

const UserProfile = () => {
  const loaderData = useLoaderData<LoaderData>();
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
  const { showPrimary, setShowPrimary, setShowSecondary } =
    useDashboardActions();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const changes = useRef(new Set<HTMLElement>());
  const { user } = useUser();
  const saveImage = useCallback(
    (file: File) => {
      if (user) return user.setProfileImage({ file });
      return Promise.reject("No user available");
    },
    [user]
  );
  useEffect(() => {
    if (actionData?.success) {
      setSnackbarOpen(true);
      changes.current.clear();
      setShowPrimary(false);
    }
  }, [setSnackbarOpen, actionData, setShowPrimary, changes.current]);
  useEffect(() => {
    setShowSecondary(completed);
  }, [completed, setShowSecondary]);
  const defaultProfileType = "creator";
  const [profileType, setProfileType] = useState(defaultProfileType);
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
        if (changes.current.size && !showPrimary) {
          setShowPrimary(true);
        } else if (!changes.current.size && showPrimary) {
          setShowPrimary(false);
        }
      }}
    >
      <ContentContainer>
        <ProfileCard iconName={"personFine"}>
          <SectionTitle style={{ marginBottom: 32 }}>
            Your fundraising Profile
          </SectionTitle>
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
              <RadioGroup
                options={USER_PROFILE_TYPES}
                defaultValue={defaultProfileType}
                renderItem={({ active, label, description }) => (
                  <ProfileTypeContainer active={active}>
                    <ProfileTypeLabel>{label}</ProfileTypeLabel>
                    <ProfileTypeDescription>
                      {description}
                    </ProfileTypeDescription>
                  </ProfileTypeContainer>
                )}
                onChange={setProfileType}
              />
            </NameAreaBox>
            <ProfileImageContainer>
              <ProfileImageBox>
                <ImageUploader
                  title="Upload photo"
                  subtitle="Select a profile photo"
                  handleSuccess={saveImage}
                >
                  <img
                    src={
                      user?.profileImageUrl || "/images/profile-default.jpeg"
                    }
                    width={"100%"}
                    height={"100%"}
                  />
                </ImageUploader>
              </ProfileImageBox>
              <ProfileImageChangeOverlay>
                <Icon name={"dollar"} heightAndWidth="24px" color="purple" />
              </ProfileImageChangeOverlay>
            </ProfileImageContainer>
          </NameandProfileImageSection>
          <SubSection>
            <SubSectionTitle>
              {profileType === "creator" && "Why should people invest in you?"}
              {profileType === "investor" &&
                "Why should people raise from you?"}
            </SubSectionTitle>
            <QuestionaireBox>
              {QUESTIONAIRES.filter((q) => q.type === profileType).map(
                ({ q, id }) => (
                  <TextFieldBox key={id}>
                    <TextFieldDescription required>{q}</TextFieldDescription>
                    <TextInputContainer width={"600px"}>
                      <TextInputMultiLine
                        key={id}
                        name={`questionaires-${id}`}
                        required
                        defaultValue={questionaires[id]}
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                )
              )}
            </QuestionaireBox>
          </SubSection>
          {profileType === "creator" && (
            <>
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
            </>
          )}
          {profileType === "investor" && (
            <>{/** what else do we want here? */}</>
          )}
        </ProfileCard>

        <ProfileCard iconName={"webIcon"}>
          <SectionTitle>Social Connections</SectionTitle>
          <InfoText>How can people find you?</InfoText>
          <QuestionaireBox>
            {SOCIAL_PROFILES.map(({ iconName }, i) => (
              <SocialProfile
                key={i}
                iconName={iconName}
                defaultValue={socialProfiles[i]}
              />
            ))}
          </QuestionaireBox>
        </ProfileCard>

        <ProfileCard iconName={"dollar"}>
          <PaymentPreferences defaultValue={paymentPreferences} />
        </ProfileCard>

        <ProfileCard iconName={"book"}>
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
        </ProfileCard>
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

export const handle = {
  title: "Your Profile",
  primaryLabel: "Save Edits",
  secondaryLabel: "View Public Profile",
  onSecondary: ({ data }: { data: LoaderData }) =>
    window.open(`/creator/${data.id}`),
};

export default UserProfile;
