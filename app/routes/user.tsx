import { getMeta, themeProps } from "~/_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import Loading from "@dvargas92495/ui/dist/components/Loading";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Body from "@dvargas92495/ui/dist/components/Body";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import GlobalStyles from "@mui/material/GlobalStyles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";
import CountryRegionData from "country-region-data";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import type { Handler as GetHandler } from "../../functions/fundraises/get";
import type { Handler as ContractHandler } from "../../functions/contract/post";
import type { Handler as ContractRefreshHandler } from "../../functions/contract-refresh/put";
import type { Handler as GetRefreshHandler } from "../../functions/contract-refresh/get";
import type { Handler as GetContractHandler } from "../../functions/contract/get";
import type { Handler as DeleteHandler } from "../../functions/contract/delete";
import type { Handler as PostAgreementHandler } from "../../functions/agreement/post";
import type { Handler as DeleteAgreementHandler } from "../../functions/agreement/delete";
import type { Handler as ProfileHandler } from "../../functions/creator-profile/put";
import {
  Link as RRLink,
  HashRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import CONTRACT_STAGES from "../../db/contract_stages";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import PaymentPreferences, {
  PaymentPreferenceValue,
} from "~/_common/PaymentPreferences";
import QUESTIONAIRES from "~/_common/questionaires";
import pdfViewerCore from "@react-pdf-viewer/core/lib/styles/index.css";
import pdfViewerLayout from "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { LinksFunction } from "remix";
import formatAmount from "../../db/util/formatAmount";
import Icon from "../_common/Icon";
import styled from 'styled-components'
import { PrimaryAction } from '../_common/PrimaryAction'
import { SecondaryAction } from '../_common/SecondaryAction'


const TopBar = styled.div`
  height: 100px;
  background: ${themeProps.palette.color.white};
  border-bottom: solid 1px ${themeProps.palette.color.lightgrey};
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  position: fixed;
  z-index: 10;
`

const ContentContainer = styled.div`
  padding: 50px;
  margin-top: 80px;
  width: 835px;
`

const ActionButton = styled.div`
  display: flex;
  grid-gap: 10px;
  
`

const SubSection = styled.div`
  margin-top: 60px;
`
const SubSectionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: ${themeProps.palette.color.darkerText};
  margin-bottom: 20px;
`

const InfoArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 750px;
`

const PageTitle = styled.div`
    font-weight: 900;
    font-size: 30px;
`

const Section = styled.div`
    background: ${themeProps.palette.color.white};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 50px;
    margin-bottom: 30px;
`

const SectionCircle = styled.div`
    background: ${themeProps.palette.color.backgroundColorDarker};
    border-radius: 100px;
    height: 80px;
    width: 80px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SectionTitle = styled.div`
    color: ${themeProps.palette.text.primary};
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 5px;
`

const InfoText = styled.div`
    color: ${themeProps.palette.text.secondary};
    font-size: 16px;
    margin-bottom: 40px;
    font-weight: 500;
`

const TextFieldBox = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  grid-gap: 5px;

`

const TextFieldDescription = styled(FormLabel) <{ small: boolean }>`
  color: ${themeProps.palette.text.tertiary};
  font-size: ${(props) => props.small ? '14px !important' : '16px !important'};
  font-weight: 400;
`


const TextInputContainer = styled.div<{ width?: string }>`
    display: flex;
    grid-auto-flow: column;
    grid-gap: 10px;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid ${themeProps.palette.color.lightgrey};
    height: 50px;
    border-radius: 8px;
    max-width: ${props => props.width ? props.width : '350px'};
    width: ${(props) => props.width ? props.width : 'fill-available'};
    height: fit-content;


    & > div {
      font-size: 14px;
    }
`

const TextInputOneLine = styled.input`
    outline: none;
    height: fill-available;
    width: fill-available;
    font-size: 14px;
    border: none;
    background: transparent;
    padding: 15px 10px;
    min-height: 30px;
    color: ${themeProps.palette.text.primary}

    &::placeholder {
        color: #96A0B5;
    }
`

const TextInputMultiLine = styled.textarea`
    outline: none;
    height: fill-available;
    width: fill-available;
    color: #96A0B5;
    font-size: 14px;
    border: none;
    padding: 15px 15px;
    min-height: 150px;
    background: transparent;
    &::placeholder {
        color: #96A0B5;
    }
`

const AddressBox = styled.div`

`

const NameAreaBox = styled.div`

`

const AddressArea = styled.div`
  display: flex;
  align-items: flex-end;
  grid-gap: 5px;
  width: fill-available;
`

const QuestionaireBox = styled.div`
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
`

const SocialProfileRow = styled.div`
    display: flex;
    flex-direction: row;
    grid-gap: 15px;
    align-items: center;
    justify-content: flex-start;
`

const MenuListItem = styled.div`
    height: 60px;
    padding: 0 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 10px;
    border-radius: 8px;
    grid-gap: 10px;
    width: fill-available;
    color: ${themeProps.palette.color.lighterText};

    &:hover {
      background: ${themeProps.palette.color.backgroundColorDarker};
    }

    & * {
      width: fill-available;
    }

    > a {
      width: fill-available;
    }
`

const NameandProfileImageSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  grid-gap: 30px;
`

const ListItemIcon = styled.div`
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const MenuSidebarContainer = styled.div`
    display: flex;
    padding: 100px 0;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`

const ListItemText = styled.div`
  font-size: 14px;
`

const ProfileImageContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  margin: 30px;
`

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
`

const ProfileImageBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid #347ae2;
  border-radius: 300px;
  margin: 1px;
  cursor: pointer;


  &:hover {
      ${ProfileImageChangeOverlay} {
        display: flex;
    }
  }

  & * {
    height: fill-available;
    width: fill-available;
  }
`



const CompanyLogo = require('../_common/Images/memexlogo.png')

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

const H1 = (props: Parameters<typeof _H1>[0]) => (
  <_H1 sx={{ fontSize: 30, ...props.sx }} {...props} />
);

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
);

const SOCIAL_PROFILES = [
  { iconName: "twitter" },
  { iconName: "github" },
  { iconName: "linkedin" },
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

const Questionaire = React.memo(
  ({
    q,
    val = "",
    setVal,
  }: {
    q: string;
    val?: string;
    setVal: (s: string) => void;
  }) => (
    <TextInputMultiLine
      label={q}
      multiline
      value={val}
      minRows={4}
      onChange={(e) => setVal(e.target.value)}
      required
      fullWidth
    />
  )
);

const ProfileContent = () => {
  const {
    id,
    update,
    firstName,
    lastName,
    emailAddresses,
    primaryEmailAddressId,
    profileImageUrl,
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
  const [middleNameValue, setMiddleNameValue] = useState(middleName || "");
  const [lastNameValue, setLastNameValue] = useState(lastName || "");
  const [contactEmailValue, setContactEmailValue] = useState(
    contactEmail || ""
  );
  const [socialProfileValues, setSocialProfileValues] = useState(
    (socialProfiles as string[]) || SOCIAL_PROFILES.map(() => "")
  );
  const [questionaireValues, setQuestionaireValues] = useState(
    (questionaires as string[]) || QUESTIONAIRES.map(() => "")
  );
  const [attachDeckValue, setAttachDeckValue] = useState(attachDeck || "");
  const [companyNameValue, setCompanyNameValue] = useState(companyName || "");
  const [registeredCountryValue, setRegisteredCountryValue] = useState(
    registeredCountry || ""
  );
  const [companyRegistrationNumberValue, setCompanyRegistrationNumberValue] =
    useState(companyRegistrationNumber || "");
  const [companyAddressStreetValue, setCompanyAddressStreetValue] = useState(
    companyAddressStreet || ""
  );
  const [companyAddressNumberValue, setCompanyAddressNumberValue] = useState(
    companyAddressNumber || ""
  );
  const [companyAddressCityValue, setCompanyAddressCityValue] = useState(
    companyAddressCity || ""
  );
  const [companyAddressZipValue, setCompanyAddressZipValue] = useState(
    companyAddressZip || ""
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
          <PageTitle>
            Your Profile
          </PageTitle>
          <ActionButton>
            {completed && (
              <SecondaryAction
                onClick={() => window.open(`/creator/${id}`)}
                // variant={"outlined"}
                target="_blank"
                rel="noopener"
                label={'View Public Profile'}
                height={'40px'}
                width={'180px'}
                fontSize={'16px'}
              />
            )}
            {isChanges &&
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
                // variant={"contained"}
                isLoading={loading}
                disabled={!isChanges}
                label={'Save Edits'}
                height={'40px'}
                width={'130px'}
                fontSize={'16px'}
              />
            }
          </ActionButton>
        </InfoArea>
        <UserButton />
      </TopBar>
      <ContentContainer>
        <Section>
          <SectionCircle>
            <Icon
              name={'personFine'}
              heightAndWidth="24px"
              color='purple'
            />
          </SectionCircle>
          <SectionTitle>
            Your fundraising Profile
          </SectionTitle>
          <InfoText>
            This is what investors will see first
          </InfoText>
          <NameandProfileImageSection>
            <NameAreaBox>
              <TextFieldBox>
                <TextFieldDescription required>
                  Name of you, your company or research project.
                </TextFieldDescription>
                <TextInputContainer
                  width={'350px'}
                >
                  <TextInputOneLine
                    value={firstNameValue}
                    onChange={(e) => setFirstNameValue(e.target.value)}
                    label={"First Name"}
                    required
                    fullWidth
                  />
                </TextInputContainer>
              </TextFieldBox>
              <TextFieldBox>
                <TextFieldDescription required>
                  Contact Email
                </TextFieldDescription>
                <TextInputContainer
                  width={'350px'}
                >
                  <TextInputOneLine
                    value={contactEmailValue}
                    helperText={"visible to investors"}
                    onChange={(e) => setContactEmailValue(e.target.value)}
                    required
                    label={"Contact Email"}
                    fullWidth
                  />
                </TextInputContainer>
              </TextFieldBox>
            </NameAreaBox>
            <ProfileImageContainer>
              {/* <img
                src={profileImageUrl}
                alt={"Profile Image"}
                style={{ borderRadius: "150px" }}
                width={200}
                height={200}

              /> */}
              <ProfileImageBox>
                <img
                  src={CompanyLogo}
                  alt={"Profile Image"}
                  style={{ borderRadius: "150px" }}

                />
              </ProfileImageBox>
              <ProfileImageChangeOverlay>
                <Icon
                  name={'dollar'}
                  heightAndWidth="24px"
                  color='purple'
                />
              </ProfileImageChangeOverlay>
            </ProfileImageContainer>

          </NameandProfileImageSection>
          <SubSection>
            <SubSectionTitle>
              Why should people invest in you?
            </SubSectionTitle>
            <QuestionaireBox>
              {QUESTIONAIRES.map(({ q }, i) => (<>
                <TextFieldBox>
                  <TextFieldDescription>
                    {q}
                  </TextFieldDescription>
                  <TextInputContainer width={'600px'}>
                    <Questionaire
                      key={i}
                      q={q}
                      val={questionaireValues[i]}
                      setVal={(newValue) =>
                        setQuestionaireValues(
                          questionaireValues.map((oldValue, j) =>
                            i === j ? newValue : oldValue
                          )
                        )
                      }
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </>))}
            </QuestionaireBox>
          </SubSection>
          <SubSection>
            <SubSectionTitle>
              How can people find you?
            </SubSectionTitle>
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
            <SubSectionTitle>
              Attach a deck or demo video
            </SubSectionTitle>
            <TextInputContainer
              width={'350px'}
            >
              <TextInputOneLine
                value={attachDeckValue}
                onChange={(e) => setAttachDeckValue(e.target.value)}
                placeholder="https://"
                label={"Attach Deck"}
                sx={{ mb: 2 }}
                fullWidth
              />
            </TextInputContainer>
          </SubSection>
        </Section>


        <Section>
          <SectionCircle>
            <Icon
              name={'dollar'}
              heightAndWidth="24px"
              color='purple'
            />
          </SectionCircle>
          <SectionTitle>
            Payment Preferences
          </SectionTitle>
          <InfoText>
            Which payment channels do yo support for receiving and sending funds?
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
            <Icon
              name={'book'}
              heightAndWidth="24px"
              color='purple'
            />
          </SectionCircle>
          <SectionTitle>
            Legal Information
          </SectionTitle>
          <InfoText>
            You must have a registered company to be able to use this service. If
            you do not, there are fast ways to open up a company.{" "}
            <ExternalLink href={"https://stripe.com/atlas"}>
              Learn More.
            </ExternalLink>
          </InfoText>
          <Box>
            <TextFieldBox>
              <TextFieldDescription>Company Name</TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  label={"Company Name"}
                  value={companyNameValue}
                  onChange={(e) => setCompanyNameValue(e.target.value)}
                  required
                  fullWidth
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldBox>
              <TextFieldDescription required>Registered Country</TextFieldDescription>
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
              <TextFieldDescription required>Registration Number</TextFieldDescription>
              <TextInputContainer>
                <TextInputOneLine
                  label={"Company Registration Number"}
                  value={companyRegistrationNumberValue}
                  onChange={(e) => setCompanyRegistrationNumberValue(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  fullWidth
                />
              </TextInputContainer>
            </TextFieldBox>
            <TextFieldDescription required>Address</TextFieldDescription>
            <AddressArea>
              <AddressBox>
                <TextFieldBox>
                  <TextFieldDescription small required>Street</TextFieldDescription>
                  <TextInputContainer
                    width={'300px'}
                  >
                    <TextInputOneLine
                      label={"Street"}
                      value={companyAddressStreetValue}
                      onChange={(e) => setCompanyAddressStreetValue(e.target.value)}
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription small required>City</TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      label={"City"}
                      value={companyAddressCityValue}
                      onChange={(e) => setCompanyAddressCityValue(e.target.value)}
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </AddressBox>
              <AddressBox>
                <TextFieldBox>
                  <TextFieldDescription small required>Nr.</TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      sx={{ ml: 2 }}
                      label={"No"}
                      value={companyAddressNumberValue}
                      onChange={(e) => setCompanyAddressNumberValue(e.target.value)}
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
                <TextFieldBox>
                  <TextFieldDescription small required>ZIP</TextFieldDescription>
                  <TextInputContainer>
                    <TextInputOneLine
                      label={"Zip"}
                      value={companyAddressZipValue}
                      onChange={(e) => setCompanyAddressZipValue(e.target.value)}
                      required
                    />
                  </TextInputContainer>
                </TextFieldBox>
              </AddressBox>
            </AddressArea>
          </Box>
        </Section>
      </ContentContainer >
    </Box >
  );
};

type Fundraises = Awaited<ReturnType<GetHandler>>["fundraises"];

const DetailComponentById: Record<
  string,
  (props: Record<string, string>) => React.ReactElement
> = {
  isa: (props) => {
    const {
      amount,
      cap,
      frequency = 1,
      return: financialReturn,
      share,
      supportType,
      threshold,
      clauses,
    } = props;
    const [showMore, setShowMore] = useState(false);
    return (
      <Box
        display={"flex"}
        sx={{
          "& p": {
            marginTop: 0,
          },
        }}
      >
        <Box sx={{ minWidth: "40px" }}>
          {showMore ? (
            <IconButton onClick={() => setShowMore(false)}>
              <Icon name={"arrow-drop-down"} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setShowMore(true)}>
              <Icon name={"arrow-right"} />
            </IconButton>
          )}
        </Box>
        <Box>
          <p>
            {" "}
            Looking to raise <b>${formatAmount(Number(amount))}</b> paid out{" "}
            <b>{supportType}</b>
            {supportType === "once" ? "" : `, ${frequency} times.`}
          </p>
          {showMore && (
            <>
              <p>
                Investor will receive {share}% of revenue above $
                {Number(threshold) / 12} per month
              </p>
              <p>Total will be capped at either</p>
              <ul>
                <li>{Number(financialReturn)}% of initial investment or</li>
                <li>{cap} years</li>
              </ul>
              <p>Additional clauses:</p>
              <ul>
                <li>{clauses}</li>
              </ul>
            </>
          )}
        </Box>
      </Box>
    );
  },
  loan: () => <div>Coming Soon!</div>,
  safe: () => <div>Coming Soon!</div>,
  saft: () => <div>Coming Soon!</div>,
};

const FundraiseContentRow = ({
  onDeleteSuccess,
  ...row
}: Fundraises[number] & { onDeleteSuccess: (uuid: string) => void }) => {
  const [isOpen, setIsOpen] = useState<HTMLButtonElement | undefined>();
  const deleteHandler = useAuthenticatedHandler<DeleteHandler>({
    method: "DELETE",
    path: "contract",
  });
  const onDelete = useCallback(() => {
    deleteHandler({
      uuid: row.uuid,
    }).then(() => onDeleteSuccess(row.uuid));
  }, [row]);
  const navigate = useNavigate();
  const onPreview = useCallback(() => {
    navigate(`/fundraises/preview/${row.uuid}`);
  }, [navigate, row.uuid]);
  const DetailComponent = DetailComponentById[row.type];
  return (
    <TableRow>
      <TableCell>{row.type}</TableCell>
      <TableCell sx={{ width: "320px" }}>
        <DetailComponent
          {...Object.fromEntries(row.details.map((d) => [d.label, d.value]))}
        />
      </TableCell>
      <TableCell>{row.progress}</TableCell>
      <TableCell>{row.investorCount}</TableCell>
      <TableCell sx={{ minWidth: "240px" }}>
        <Box flex={"display"} alignItems={"center"}>
          <Button
            variant="outlined"
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate(`/fundraises/contract/${row.uuid}`, {
                state: { isOpen: true },
              });
            }}
          >
            Invite Investor
          </Button>
          <IconButton onClick={(e) => setIsOpen(e.target as HTMLButtonElement)}>
            <Icon name={"more-vert"} />
          </IconButton>
        </Box>
        <Popover
          open={!!isOpen}
          anchorEl={isOpen}
          onClose={() => setIsOpen(undefined)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem
              button
              onClick={() => {
                navigate(`/fundraises/contract/${row.uuid}`);
              }}
              sx={{ display: "flex" }}
            >
              <ListItemIcon>
                <Icon name={"preview"} />
              </ListItemIcon>
              <ListItemText primary={"See Investors"} />
            </ListItem>
            <ListItem button onClick={onPreview} sx={{ display: "flex" }}>
              <ListItemIcon>
                <Icon name={"preview"} />
              </ListItemIcon>
              <ListItemText primary={"Preview"} />
            </ListItem>
            <ListItem button onClick={onDelete} sx={{ display: "flex" }}>
              <ListItemIcon>
                <Icon name={"delete"} />
              </ListItemIcon>
              <ListItemText primary={"Delete"} />
            </ListItem>
          </List>
        </Popover>
      </TableCell>
    </TableRow>
  );
};

const FundraiseContentTable = () => {
  const {
    publicMetadata: { completed = false },
  } = useUser();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Fundraises>([]);
  const getFundraises = useAuthenticatedHandler<GetHandler>({
    path: "fundraises",
    method: "GET",
  });
  const onDeleteSuccess = useCallback(
    (uuid: string) => {
      setRows(rows.filter((r) => r.uuid !== uuid));
    },
    [setRows, rows]
  );
  useEffect(() => {
    if (completed) {
      setLoading(true);
      getFundraises()
        .then((r) => setRows(r.fundraises))
        .finally(() => setLoading(false));
    }
  }, [getFundraises, setRows, setLoading, completed]);
  const navigate = useNavigate();
  const startFundraiseButton = useMemo(
    () => (
      <Button
        variant={"contained"}
        onClick={() => navigate(`/fundraises/setup`)}
      >
        Start New Fundraise
      </Button>
    ),
    [navigate]
  );
  const Container: React.FC = loading
    ? ({ children }) => (
      <Skeleton variant={"rectangular"} sx={{ minHeight: "60vh" }}>
        {children}
      </Skeleton>
    )
    : Box;
  return (
    <>
      <H1
        sx={{
          fontSize: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Fundraises
        {!!rows.length && startFundraiseButton}
      </H1>
      {completed ? (
        <Container>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell># Investors</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <FundraiseContentRow
                  key={row.uuid}
                  {...row}
                  onDeleteSuccess={onDeleteSuccess}
                />
              ))}
            </TableBody>
          </Table>
          {!rows.length && (
            <Box sx={{ mt: 4 }} textAlign={"center"}>
              <H4>Set up your first fundraise</H4>
              {startFundraiseButton}
            </Box>
          )}
        </Container>
      ) : (
        <Body>
          <RRLink to={TABS[0].path}>Setup your profile</RRLink> in order to
          start fundraising.
        </Body>
      )}
    </>
  );
};

const ChooseFundraiseType = () => {
  const navigate = useNavigate();
  return (
    <>
      <H1>Step 1: Choose your fundraise type</H1>
      {FUNDRAISE_TYPES.map(({ name, description, help, enabled, id }) => (
        <Card
          sx={{ display: "flex", height: 160, borderRadius: 2, py: 2, mb: 2 }}
          key={id}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              pl: 5,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <H4 sx={{ my: 1, fontSize: "16px", lineHeight: "20px" }}>
                {name}
              </H4>
              <Body
                sx={{
                  color: "#3F3F3F",
                  fontSize: "12px",
                  lineHeight: "18px",
                  opacity: 0.7,
                }}
              >
                {description}
              </Body>
            </Box>
            <Box>
              <Body
                sx={{
                  color: "#3F3F3F",
                  fontSize: "12px",
                  lineHeight: "18px",
                  fontWeight: 600,
                  opacity: 0.7,
                }}
              >
                {help}
              </Body>
            </Box>
          </Box>
          <Box
            sx={{
              px: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {enabled ? (
              <Button
                variant={"contained"}
                onClick={() =>
                  navigate("/fundraises/details", {
                    state: { id },
                  })
                }
              >
                Select
              </Button>
            ) : (
              <Button disabled variant={"outlined"}>
                Coming Soon
              </Button>
            )}
          </Box>
        </Card>
      ))}
    </>
  );
};

type DetailProps = {
  data: Record<string, string>;
  setData: (e: Record<string, string>) => void;
};

const ISA_SUPPORT_TYPES = [
  {
    label: "Monthly Stipend",
    description: "Get a monthly payout & cancel anytime",
    value: "monthly",
  },
  {
    label: "One-time Payout",
    description: "Get a one-time payment from your supporters",
    value: "once",
  },
];

const ISADetailForm = ({ data, setData }: DetailProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setData({
      ...data,
      [target.name]: target.value,
    });
  };
  return (
    <>
      <FormLabel sx={{ mt: 0, mb: 2, display: "inline-block" }}>
        How do you want to receive your support?
      </FormLabel>
      <RadioGroup
        sx={{ mb: 6, display: "flex", flexDirection: "row" }}
        name="supportType"
        value={data["supportType"]}
        onChange={onChange}
      >
        {ISA_SUPPORT_TYPES.map(({ label, value, description }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "24px",
              borderRadius: "4px",
              padding: "16px",
              width: "240px",
              background: "red",
            }}
            key={value}
          >
            <Box sx={{ minWidth: "48px" }}>
              <Radio value={value} />
            </Box>
            <Box>
              <H4 sx={{ fontSize: 14 }}>{label}</H4>
              <Body sx={{ fontSize: 14 }}>{description}</Body>
            </Box>
          </Box>
        ))}
      </RadioGroup>
      {data["supportType"] === "monthly" ? (
        <Box>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TextField
              sx={{ mr: 2 }}
              type={"number"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position={"start"}>$</InputAdornment>
                ),
              }}
              name={"amount"}
              value={data["amount"]}
              onChange={onChange}
              label={"How much do you want to raise?"}
            />
            <span>per month</span>
          </Box>
          <TextField
            type={"number"}
            name={"frequency"}
            value={data["frequency"]}
            onChange={onChange}
            label={"For how many months?"}
            sx={{ mb: 2 }}
          />
          <hr />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Body sx={{ fontWeight: 600 }}>Total Funding Request</Body>
            <Body>
              $
              {formatAmount(
                (Number(data["amount"]) || 0) * (Number(data["frequency"]) || 1)
              )}
              .00
            </Body>
          </Box>
        </Box>
      ) : data["supportType"] === "once" ? (
        <Box>
          <TextField
            type={"number"}
            InputProps={{
              startAdornment: (
                <InputAdornment position={"start"}>$</InputAdornment>
              ),
            }}
            name={"amount"}
            value={data["amount"]}
            onChange={onChange}
            label={"How much do you want to raise?"}
          />
        </Box>
      ) : (
        <Box />
      )}
      <Box sx={{ mb: "144px" }} />
      <H4>Return Conditions</H4>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          sx={{ mr: 2 }}
          type={"number"}
          InputProps={{
            endAdornment: <InputAdornment position={"end"}>%</InputAdornment>,
          }}
          name={"return"}
          value={data["return"]}
          onChange={onChange}
          label={"What will be the investor's maximum return on investment?"}
          helperText={<a>Get help on how to determine a fair return</a>}
        />{" "}
        <span>
          ={" max $"}
          {formatAmount(
            ((Number(data["return"]) || 0) / 100) *
            (Number(data["amount"]) || 0) *
            (Number(data["frequency"]) || 1)
          )}
        </span>
      </Box>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          sx={{ mr: 2 }}
          type={"number"}
          InputProps={{
            startAdornment: (
              <InputAdornment position={"start"}>$</InputAdornment>
            ),
          }}
          name={"threshold"}
          value={data["threshold"]}
          onChange={onChange}
          label={"Your abundance threshold"}
          helperText={
            "The yearly income (before taxes) after which you start paying back"
          }
        />{" "}
        <span>
          = average ${formatAmount((Number(data["threshold"]) || 0) / 12)} /
          month
        </span>
      </Box>
      <TextField
        sx={{ mb: 2 }}
        type={"number"}
        InputProps={{
          startAdornment: <InputAdornment position={"start"}>%</InputAdornment>,
        }}
        name={"share"}
        value={data["share"]}
        onChange={onChange}
        label={"Share of revenue used for payback"}
        helperText={
          "% of your income you want to use for the payback once you hit the abundance threshold"
        }
      />
      <TextField
        sx={{ mb: 2 }}
        type={"number"}
        InputProps={{
          startAdornment: <InputAdornment position={"start"}>Y</InputAdornment>,
        }}
        name={"cap"}
        value={data["cap"]}
        onChange={onChange}
        label={"Time Cap"}
        helperText={
          "Number of years before this agreement runs out, whether you paid everything back or not."
        }
      />
      <TextField
        sx={{ mb: 2 }}
        name={"clauses"}
        value={data["clauses"]}
        onChange={onChange}
        label={"Additional Contract Clauses"}
        multiline
        minRows={5}
        helperText={
          <span>
            Do you have any special requirements in this contract that you'd
            like to add? It is <b>strongly</b> advised to cross-check these
            terms with a legal professional.
          </span>
        }
      />
    </>
  );
};

const NoForm = () => {
  return <Box>Coming Soon...</Box>;
};

const FUNDRAISE_DETAIL_FORMS: {
  [k in typeof FUNDRAISE_TYPES[number]["id"]]: (
    p: DetailProps
  ) => React.ReactElement;
} = {
  isa: ISADetailForm,
  loan: NoForm,
  safe: NoForm,
  saft: NoForm,
};

const FUNDRAISE_NAMES_BY_IDS = Object.fromEntries(
  FUNDRAISE_TYPES.map(({ name, id }) => [id, name])
);

const FundraiseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contractHandler = useAuthenticatedHandler<ContractHandler>({
    path: "contract",
    method: "POST",
  });
  const [data, setData] = useState<Record<string, string>>({});
  const id = useMemo(
    () => (location.state?.id as keyof typeof FUNDRAISE_DETAIL_FORMS) || "isa",
    []
  );
  const DetailForm = useMemo(() => FUNDRAISE_DETAIL_FORMS[id], [id]);
  return (
    <>
      <H1>Step 2: {FUNDRAISE_NAMES_BY_IDS[id]} Contract Details</H1>
      <form
        onSubmit={(e) => {
          /* In case performance is too bad... REMIX
          const formElement = e.target as HTMLFormElement;
          const data = Object.fromEntries(
            Object.keys(formElement.elements)
              .filter((k) => isNaN(Number(k)))
              .map((k) => [
                k,
                (formElement.elements.namedItem(k) as { value: string | null })
                  ?.value || "",
              ])
          );
          */
          setLoading(true);
          contractHandler({ data, id })
            .then((state) =>
              navigate(`/fundraises/preview/${state.id}`, {
                state: { initialCreate: true },
              })
            )
            .catch((e) => {
              setError(e.message);
              setLoading(false);
            });
          e.preventDefault();
        }}
      >
        <DetailForm data={data} setData={setData} />
        <Box display={"flex"} alignItems={"center"}>
          <Button
            variant={"contained"}
            type={"submit"}
            sx={{ marginRight: "16px" }}
          >
            Save {"&"} Preview Contract
          </Button>
          {loading && <CircularProgress size={20} />}
        </Box>
        <Body sx={{ color: "error" }}>{error}</Body>
      </form>
    </>
  );
};

const FundraisePreview = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const state = useLocation().state;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const refreshPreview = useAuthenticatedHandler<ContractRefreshHandler>({
    method: "PUT",
    path: "contract-refresh",
  });
  const getRefresh = useAuthenticatedHandler<GetRefreshHandler>({
    method: "GET",
    path: "contract-refresh",
  });
  const [loading, setLoading] = useState(state?.initialCreate);
  const onRefresh = useCallback(() => {
    setLoading(true);
    refreshPreview({ uuid: id }).then(() => setLoading(false));
  }, [setLoading, id, refreshPreview]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.metaKey && e.altKey && e.key === "R") {
        onRefresh();
      }
    };
    if (state?.initialCreate)
      getRefresh({ uuid: id }).then(() => setLoading(false));
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [onRefresh, state?.initialCreate, getRefresh, id, setLoading]);
  return (
    <>
      <H1>Step 3: Preview Contract</H1>
      <Box sx={{ height: "600px", marginBottom: "144px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "#C4C4C4",
            height: "100%",
          }}
        >
          {loading ? (
            <Skeleton
              variant={"rectangular"}
              sx={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
              <Viewer
                fileUrl={`/_contracts/${id}/draft.pdf`}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() =>
            navigate(`/fundraises/contract/${id}`, { state: { isOpen: true } })
          }
        >
          Invite Investors
        </Button>
        {process.env.NODE_ENV === "development" && (
          <Button
            variant={"outlined"}
            color={"primary"}
            onClick={() => {
              setLoading(true);
              refreshPreview({ uuid: id }).then(() => setLoading(false));
            }}
          >
            Refresh PDF Preview
          </Button>
        )}
      </Box>
    </>
  );
};

type Agreements = Awaited<ReturnType<GetContractHandler>>["agreements"];
const STAGE_COLORS = [
  "#C4C4C4",
  "#A2F159",
  "#D4E862",
  "#2FEC00",
  "#FF8B8B",
  "#8312DD",
];
const STAGE_ACTIONS: ((a: {
  contractUuid: string;
  uuid: string;
  onDelete: (uuid: string) => void;
}) => React.ReactElement)[] = [
    (row) => {
      const deleteHandler = useAuthenticatedHandler<DeleteAgreementHandler>({
        path: "agreement",
        method: "DELETE",
      });
      const [loading, setLoading] = useState(false);
      return (
        <Box
          component={"span"}
          sx={{
            color: "#0000EE",
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "none",
              cursor: "pointer",
            },
          }}
          onClick={() => {
            setLoading(true);
            deleteHandler({ uuid: row.uuid })
              .then(() => row.onDelete(row.uuid))
              .finally(() => setLoading(false));
          }}
        >
          <Box component={"span"} sx={{ marginRight: 16 }}>
            Remove Invitation
          </Box>{" "}
          <Loading loading={loading} size={16} />
        </Box>
      );
    },
    (row) => (
      <ExternalLink href={`/contract?uuid=${row.uuid}&signer=1`}>
        Send Link To Investor
      </ExternalLink>
    ),
    (row) => (
      <ExternalLink href={`/contract?uuid=${row.uuid}&signer=2`}>
        Sign Contract
      </ExternalLink>
    ),
    (row) => (
      <ExternalLink href={`/_contracts/${row.contractUuid}/${row.uuid}.pdf`}>
        View Contract
      </ExternalLink>
    ),
    () => <span />,
    () => <span />,
  ];

const AgreementRow = (
  row: Agreements[number] & {
    contractUuid: string;
    onDelete: (uuid: string) => void;
  }
) => {
  const StageAction = STAGE_ACTIONS[row.status];
  return (
    <TableRow>
      <TableCell>{row.name}</TableCell>
      <TableCell>${formatAmount(row.amount)}</TableCell>
      <TableCell>
        <Box
          sx={{
            height: 24,
            borderRadius: 12,
            px: "40px",
            py: "4px",
            backgroundColor: STAGE_COLORS[row.status],
            width: "fit-content",
            textAlign: "center",
          }}
        >
          {CONTRACT_STAGES[row.status].replace(/_/g, " ").toLowerCase()}
        </Box>
      </TableCell>
      <TableCell>
        <StageAction
          uuid={row.uuid}
          contractUuid={row.contractUuid}
          onDelete={row.onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

const FundraiseContract = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [capSpace, setCapSpace] = useState(0);
  const getFundraise = useAuthenticatedHandler<GetContractHandler>({
    path: "contract",
    method: "GET",
  });
  const postAgreement = useAuthenticatedHandler<PostAgreementHandler>({
    path: "agreement",
    method: "POST",
  });
  const [rows, setRows] = useState<Agreements>([]);
  const onDelete = useCallback(
    (uuid: string) => setRows(rows.filter((r) => r.uuid !== uuid)),
    [setRows, rows]
  );
  const { type: defaultType = FUNDRAISE_TYPES[0].id } = location.state || {};
  const [type, setType] = useState(defaultType);
  useEffect(() => {
    setLoading(true);
    getFundraise({ uuid: id })
      .then((r) => {
        setType(r.type);
        setRows(r.agreements);
        setCapSpace(
          Number(r.details.amount) * (Number(r.details.frequency) || 1) -
          r.agreements.reduce((p, c) => p + c.amount, 0)
        );
      })
      .finally(() => setLoading(false));
  }, [id, setType, setRows, setLoading, setCapSpace]);
  const Container: React.FC = loading
    ? ({ children }) => (
      <Skeleton variant={"rectangular"} sx={{ minHeight: "60vh" }}>
        {children}
      </Skeleton>
    )
    : Box;
  const defaultIsOpen = useMemo(() => location.state?.isOpen, [location]);
  return (
    <>
      <H1
        sx={{
          fontSize: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          component={"span"}
          sx={{
            a: {
              textDecoration: "none",
              color: "#333333",
            },
          }}
        >
          <RRLink to={"/fundraises"}>Your Fundraises</RRLink>
          {" > "}
          {FUNDRAISE_NAMES_BY_IDS[type]}
        </Box>
        <FormDialog<{ name: string; email: string; amount: number }>
          formElements={{
            name: {
              defaultValue: "",
              order: 0,
              component: StringField,
              validate: (s) => (!s ? "Name is required" : ""),
            },
            email: {
              defaultValue: "",
              order: 1,
              component: StringField,
              validate: (s) => (!s ? "Email is required" : ""),
            },
            amount: {
              defaultValue: 0,
              order: 2,
              component: NumberField,
              validate: (n) => {
                if (n < 100) {
                  return "Amount must be greater than $100";
                }
                if (capSpace < n) {
                  return `Requested more than available cap space: $${formatAmount(
                    capSpace
                  )}`;
                }
                return "";
              },
            },
          }}
          title={"Invite New Investor"}
          buttonText={"Invite Investor"}
          onSave={(body) =>
            postAgreement({ uuid: id, ...body }).then((r) =>
              setRows([...rows, { ...body, uuid: r.uuid, status: 0 }])
            )
          }
          defaultIsOpen={defaultIsOpen}
        />
      </H1>
      <Container>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Investor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <AgreementRow
                key={row.uuid}
                {...row}
                contractUuid={id}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

const FundraiseSign = () => {
  return (
    <>
      <H1>Step 4: Sign Contract</H1>
      <Box>Coming Soon...</Box>
    </>
  );
};

const FundraiseContent = () => {
  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Outlet />
    </Box>
  );
};

const DRAWER_WIDTH = 255;
const TABS = [
  {
    text: "My Profile",
    iconName: "home",
    content: ProfileContent,
    path: "",
    nested: [],
  },
  {
    text: "My Fundraises",
    iconName: "fundraise",
    content: FundraiseContent,
    path: "fundraises",
    nested: [
      { content: FundraiseContentTable, path: "" },
      { content: ChooseFundraiseType, path: "setup" },
      { content: FundraiseDetails, path: "details" },
      { content: FundraisePreview, path: "preview/:id" },
      { content: FundraiseSign, path: "sign/:id" },
      { content: FundraiseContract, path: "contract/:id" },
    ],
  },
  {
    text: "Settings",
    iconName: "settings",
    content: () => <div>Coming Soon!</div>,
    path: "settings",
    nested: [],
  },
] as const;

const DashboardTab = ({ path, iconName, text }: typeof TABS[number]) => {
  const location = useLocation();
  const isMatch = path
    ? location.pathname.startsWith(`/${path}`)
    : location.pathname === "/";

  console.log(iconName)
  return (
    <RRLink to={path}>
      <MenuListItem
      >
        <ListItemIcon>
          <Icon heightAndWidth="20px" name={iconName} />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuListItem>
    </RRLink>
  );
};

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          backgroundColor: themeProps.palette.background.default,
        }}
        elevation={0}
      >
      </AppBar> */}
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: themeProps.palette.color.white,
            borderRight: '1px solid #f0f0f0'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <Toolbar>
          <Link href="/">Home</Link>
        </Toolbar> */}
        <List
          sx={{
            a: {
              textDecoration: "none",
              width: '100%',
            },
          }}
        >
          <MenuSidebarContainer>
            {TABS.map((t) => (
              <DashboardTab {...t} key={t.path} />
            ))}
          </MenuSidebarContainer>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 2,
          color: "text.primary",
          height: "fit-content",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        {/* <Toolbar /> */}
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

const globalStyles = (
  <GlobalStyles
    styles={{
      html: { height: "100%" },
      body: { height: "100%" },
      "body > div[data-reactroot]": { height: "100%" },
    }}
  />
);

const UserPage = (): React.ReactElement => (
  <Document themeProps={themeProps}>
    {globalStyles}
    <style>{clerkUserProfileCss}</style>
    <SignedIn>
      <HashRouter>
        <Routes>
          <Route element={<Dashboard />} path={"/"}>
            {TABS.map(({ content: Content, path, nested }) =>
              path === "" ? (
                <Route element={<Content />} key={path} index={true} />
              ) : (
                <Route element={<Content />} key={path} path={path}>
                  {nested.map(({ content: Content, path }) => (
                    <Route
                      element={<Content />}
                      key={path}
                      {...(path === "" ? { index: true } : { path })}
                    />
                  ))}
                </Route>
              )
            )}
          </Route>
        </Routes>
      </HashRouter>
    </SignedIn>
    <RedirectToLogin />
  </Document>
);
export const meta = getMeta({ title: "User" });
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: pdfViewerCore },
    { rel: "stylesheet", href: pdfViewerLayout },
  ];
};

const Title = styled('div')`
    font-size: 30px;
    color: red;
`

// const ProfileField = (props) => <TextField sx={{
// }} {...props}/>

export default UserPage;
