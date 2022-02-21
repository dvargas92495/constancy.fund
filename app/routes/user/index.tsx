import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import Box from "@mui/material/Box";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import CountryRegionData from "country-region-data";
import type { Handler as ProfileHandler } from "../../../functions/creator-profile/put";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PaymentPreferences, {
  PaymentPreferenceValue,
} from "~/_common/PaymentPreferences";
import QUESTIONAIRES from "~/_common/questionaires";
import Icon from "~/_common/Icon";
import styled from "styled-components";
import { PrimaryAction } from "~/_common/PrimaryAction";
import { SecondaryAction } from "~/_common/SecondaryAction";
import CompanyLogo from "~/_common/Images/memexlogo.png";
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
  cursor: pointer;

  &:hover {
    ${ProfileImageChangeOverlay} {
      display: flex;
    }
  }

  & > * {
    height: fill-available;
    width: fill-available;
  }
`;

const SocialProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 15px;
  align-items: center;
  justify-content: flex-start;
`;

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === null || b === null) {
    return false;
  } else if (typeof a === "string" && typeof b === "string") {
    return a === b;
  } else if (typeof a === "object" && typeof b === "object") {
    const aentries = Object.entries(a).sort((k1, k2) =>
      k1[0].localeCompare(k2[0])
    );
    const bentries = Object.entries(b).sort((k1, k2) =>
      k1[0].localeCompare(k2[0])
    );
    return (
      aentries.length === bentries.length &&
      aentries.every(([, v], i) => deepEqual(v, bentries[i][1]))
    );
  } else {
    return false;
  }
};

const SOCIAL_PROFILES = [
  { iconName: "twitter" },
  { iconName: "github" },
  { iconName: "linkedIn" },
  { iconName: "public" },
] as const;

const SocialProfile = React.memo(
  ({
    iconName,
    val = "",
    setVal,
  }: {
    iconName: typeof SOCIAL_PROFILES[number]["iconName"];
    val?: string;
    setVal: (s: string) => void;
  }) => (
    <SocialProfileRow>
      <Icon name={iconName} />
      <TextInputContainer>
        <TextInputOneLine
          placeholder="https://"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </TextInputContainer>
    </SocialProfileRow>
  )
);

const UserProfile = () => {
  const {
    id,
    update,
    firstName,
    lastName,
    emailAddresses,
    primaryEmailAddressId,
    publicMetadata: { completed = false, ...publicMetadata } = {},
  } = useUser();
  const {
    middleName,
    contactEmail = emailAddresses.find((e) => e.id === primaryEmailAddressId)
      ?.emailAddress,
    socialProfiles,
    questionaires,
    attachDeck,
    companyName,
    registeredCountry,
    companyRegistrationNumber,
    companyAddressStreet,
    companyAddressNumber,
    companyAddressCity,
    companyAddressZip,
    paymentPreference,
  } = publicMetadata;
  const profileHandler = useAuthenticatedHandler<ProfileHandler>({
    path: "creator-profile",
    method: "PUT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstNameValue, setFirstNameValue] = useState(firstName || "");
  const [middleNameValue, setMiddleNameValue] = useState(
    (middleName as string) || ""
  );
  const [lastNameValue, setLastNameValue] = useState(lastName || "");
  const [contactEmailValue, setContactEmailValue] = useState(
    (contactEmail as string) || ""
  );
  const [socialProfileValues, setSocialProfileValues] = useState(
    (socialProfiles as string[]) || SOCIAL_PROFILES.map(() => "")
  );
  const [questionaireValues, setQuestionaireValues] = useState(
    (questionaires as string[]) || QUESTIONAIRES.map(() => "")
  );
  const [attachDeckValue, setAttachDeckValue] = useState(
    (attachDeck as string) || ""
  );
  const [companyNameValue, setCompanyNameValue] = useState(
    (companyName as string) || ""
  );
  const [registeredCountryValue, setRegisteredCountryValue] = useState(
    (registeredCountry as string) || ""
  );
  const [companyRegistrationNumberValue, setCompanyRegistrationNumberValue] =
    useState((companyRegistrationNumber as string) || "");
  const [companyAddressStreetValue, setCompanyAddressStreetValue] = useState(
    (companyAddressStreet as string) || ""
  );
  const [companyAddressNumberValue, setCompanyAddressNumberValue] = useState(
    (companyAddressNumber as string) || ""
  );
  const [companyAddressCityValue, setCompanyAddressCityValue] = useState(
    (companyAddressCity as string) || ""
  );
  const [companyAddressZipValue, setCompanyAddressZipValue] = useState(
    (companyAddressZip as string) || ""
  );
  const [paymentPreferenceValue, setPaymentPreferenceValue] =
    useState<PaymentPreferenceValue>(
      typeof paymentPreference === "object" && paymentPreference
        ? (paymentPreference as PaymentPreferenceValue)
        : { type: "" }
    );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const profileBody = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    publicMetadata: {
      middleName: middleNameValue,
      contactEmail: contactEmailValue,
      socialProfiles: socialProfileValues,
      questionaires: questionaireValues,
      attachDeck: attachDeckValue,
      companyName: companyNameValue,
      registeredCountry: registeredCountryValue,
      companyRegistrationNumber: companyRegistrationNumberValue,
      companyAddressNumber: companyAddressNumberValue,
      companyAddressStreet: companyAddressStreetValue,
      companyAddressCity: companyAddressCityValue,
      companyAddressZip: companyAddressZipValue,
      paymentPreference: paymentPreferenceValue,
    },
  };
  const isChanges = !deepEqual(profileBody, {
    firstName,
    lastName,
    publicMetadata,
  });
  return (
    <Box sx={{ maxWidth: "800px" }}>
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
              />
            )}
            {isChanges && (
              <PrimaryAction
                onClick={() => {
                  setLoading(true);
                  profileHandler(profileBody)
                    .then(() => {
                      setSnackbarOpen(true);
                      return update({});
                    })
                    .catch((e) => setError(e.message))
                    .finally(() => setLoading(false));
                }}
                isLoading={loading}
                disabled={!isChanges}
                label={"Save Edits"}
                height={"40px"}
                width={"130px"}
                fontSize={"16px"}
              />
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={() => setSnackbarOpen(false)}
              color="success"
            >
              <Alert severity="success" sx={{ width: "100%" }}>
                Successfully Saved Profile!
              </Alert>
            </Snackbar>
            <span color={"darkred"}>{error}</span>
          </ActionButton>
        </InfoArea>
        <UserButton />
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
                  Name of you, your company or research project.
                </TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    value={firstNameValue}
                    onChange={(e) => setFirstNameValue(e.target.value)}
                    required
                  />
                </TextInputContainer>
              </TextFieldBox>
            </NameAreaBox>
            <ProfileImageContainer>
              <ProfileImageBox>
                <img
                  src={CompanyLogo}
                  alt={"Profile Image"}
                  style={{ borderRadius: "150px" }}
                />
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
                  <TextFieldDescription>{q}</TextFieldDescription>
                  <TextInputContainer width={"600px"}>
                    <TextInputMultiLine
                      key={i}
                      value={questionaireValues[i]}
                      onChange={(e) =>
                        setQuestionaireValues(
                          questionaireValues.map((oldValue, j) =>
                            i === j ? e.target.value : oldValue
                          )
                        )
                      }
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
                  val={socialProfileValues[i]}
                  setVal={(newValue) =>
                    setSocialProfileValues(
                      socialProfileValues.map((oldValue, j) =>
                        i === j ? newValue : oldValue
                      )
                    )
                  }
                />
              ))}
            </QuestionaireBox>
          </SubSection>
          <SubSection>
            <SubSectionTitle>Attach a deck or demo video</SubSectionTitle>
            <TextInputContainer width={"350px"}>
              <TextInputOneLine
                value={attachDeckValue}
                onChange={(e) => setAttachDeckValue(e.target.value)}
                placeholder="https://"
              />
            </TextInputContainer>
          </SubSection>
        </Section>

        <Section>
          <SectionCircle>
            <Icon name={"dollar"} heightAndWidth="24px" color="purple" />
          </SectionCircle>
          <SectionTitle>Payment Preferences</SectionTitle>
          <InfoText>
            Which payment channels do yo support for receiving and sending
            funds?
          </InfoText>
          <TextFieldBox>
            <PaymentPreferences
              value={paymentPreferenceValue}
              setValue={setPaymentPreferenceValue}
            />
          </TextFieldBox>
        </Section>

        <Section>
          <SectionCircle>
            <Icon name={"book"} heightAndWidth="24px" color="purple" />
          </SectionCircle>
          <SectionTitle>Legal Information</SectionTitle>
          <InfoText>
            You must have a registered company to be able to use this service.
            If you do not, there are fast ways to open up a company.{" "}
            <ExternalLink href={"https://stripe.com/atlas"}>
              Learn More.
            </ExternalLink>
          </InfoText>
          <Box>
            <TextFieldBox>
              <TextFieldDescription>Company Name</TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  value={companyNameValue}
                  onChange={(e) => setCompanyNameValue(e.target.value)}
                  required
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription required>
                Registered Country
              </TextFieldDescription>
              <TextInputContainer>
                <Select
                  value={registeredCountryValue}
                  maxRows={10}
                  MenuProps={{ sx: { maxHeight: 200 } }}
                  onChange={(e) => setRegisteredCountryValue(e.target.value)}
                  fullWidth
                  required
                >
                  {CountryRegionData.map((c) => (
                    <MenuItem value={c.countryName} key={c.countryShortCode}>
                      {c.countryName}
                    </MenuItem>
                  ))}
                </Select>
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription required>
                Registration Number
              </TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  value={companyRegistrationNumberValue}
                  onChange={(e) =>
                    setCompanyRegistrationNumberValue(e.target.value)
                  }
                  required
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
                      value={companyAddressStreetValue}
                      onChange={(e) =>
                        setCompanyAddressStreetValue(e.target.value)
                      }
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    City
                  </TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      value={companyAddressCityValue}
                      onChange={(e) =>
                        setCompanyAddressCityValue(e.target.value)
                      }
                      required
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
                      value={companyAddressNumberValue}
                      onChange={(e) =>
                        setCompanyAddressNumberValue(e.target.value)
                      }
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription $small required>
                    ZIP
                  </TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      value={companyAddressZipValue}
                      onChange={(e) =>
                        setCompanyAddressZipValue(e.target.value)
                      }
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </AddressBox>
            </AddressArea>

            <SubSection>
              <SubSectionTitle>Legal Representative</SubSectionTitle>
              <InfoText>
                The person who is authorized to raise funds on behalf of the company.
              </InfoText>
              <TextFieldBox>
                <TextFieldDescription required>First Name</TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    value={lastNameValue}
                    onChange={(e) => setLastNameValue(e.target.value)}
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription>
                  Last Name
                </TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    value={middleNameValue}
                    onChange={(e) => setMiddleNameValue(e.target.value)}
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription>
                  Contact Email
                </TextFieldDescription>
                <TextInputContainer width={"350px"}>
                  <TextInputOneLine
                    value={contactEmailValue}
                    onChange={(e) => setContactEmailValue(e.target.value)}
                    required
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
                        value={companyAddressStreetValue}
                        onChange={(e) =>
                          setCompanyAddressStreetValue(e.target.value)
                        }
                        required
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      City
                    </TextFieldDescription>
                    <TextInputContainer>
                      <TextInputOneLine
                        value={companyAddressCityValue}
                        onChange={(e) =>
                          setCompanyAddressCityValue(e.target.value)
                        }
                        required
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
                        value={companyAddressNumberValue}
                        onChange={(e) =>
                          setCompanyAddressNumberValue(e.target.value)
                        }
                        required
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                  <TextFieldBox>
                    <TextFieldDescription $small required>
                      ZIP
                    </TextFieldDescription>
                    <TextInputContainer>
                      <TextInputOneLine
                        value={companyAddressZipValue}
                        onChange={(e) =>
                          setCompanyAddressZipValue(e.target.value)
                        }
                        required
                      />
                    </TextInputContainer>
                  </TextFieldBox>
                </AddressBox>
              </AddressArea>
            </SubSection>
          </Box>
        </Section>
      </ContentContainer>
    </Box>
  );
};

export default UserProfile;
