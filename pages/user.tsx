import { LayoutHead, themeProps } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import React, { useEffect, useState } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ContractIcon from "@mui/icons-material/Note";
import SettingsIcon from "@mui/icons-material/Settings";
import Body from "@dvargas92495/ui/dist/components/Body";
import _H1 from "@dvargas92495/ui/dist/components/H1";
import _H4 from "@dvargas92495/ui/dist/components/H4";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import GlobalStyles from "@mui/material/GlobalStyles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import MoreIcon from "@mui/icons-material/More";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebIcon from "@mui/icons-material/Public";
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
import type { Handler as GetHandler } from "../functions/fundraises/get";

const H1 = (props: Parameters<typeof _H1>[0]) => (
  <_H1 sx={{ fontSize: 30 }} {...props} />
);

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0 }} {...props} />
);

const SOCIAL_PROFILES = [
  { icon: <TwitterIcon /> },
  { icon: <GitHubIcon /> },
  { icon: <LinkedInIcon /> },
  { icon: <WebIcon /> },
];

const QUESTIONAIRES = [
  { q: "Summary of your project or idea (500 char)" },
  { q: "What do you want to do with the money? (500 char)" },
  { q: "What's your track record as a creator of company? (500 char)" },
  { q: "What's your plans of making revenue? (500 char)" },
];

const SocialProfile = React.memo(
  ({
    icon,
    val = "",
    setVal,
  }: {
    icon: React.ReactNode;
    val?: string;
    setVal: (s: string) => void;
  }) => (
    <Box sx={{ display: "flex", mb: 2, alignItems: "center", width: "100%" }}>
      <Avatar sx={{ mx: 2 }}>{icon}</Avatar>
      <TextField
        placeholder="https://"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </Box>
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
    <TextField
      sx={{ mb: 2 }}
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

const PAYMENT_PREFERENCES = [{ label: "PayPal" }, { label: "Bank Transfer" }];

const ProfileContent = () => {
  const {
    update,
    firstName,
    emailAddresses,
    primaryEmailAddressId,
    profileImageUrl,
    unsafeMetadata: {
      middle_name,
      contact_email = emailAddresses.find((e) => e.id === primaryEmailAddressId)
        ?.emailAddress,
      social_profiles,
      questionaires,
      attach_deck,
      company_name,
      registered_country,
      company_registration_number,
      company_address_street,
      company_address_number,
      company_address_city,
      company_address_zip,
      payment_preference,
      ...rest
    } = {},
    lastName,
  } = useUser();
  const [loading, setLoading] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState(firstName || "");
  const [middleNameValue, setMiddleNameValue] = useState(middle_name || "");
  const [lastNameValue, setLastNameValue] = useState(lastName || "");
  const [contactEmailValue, setContactEmailValue] = useState(
    contact_email || ""
  );
  const [socialProfileValues, setSocialProfileValues] = useState(
    (social_profiles as string[]) || SOCIAL_PROFILES.map(() => "")
  );
  const [questionaireValues, setQuestionaireValues] = useState(
    (questionaires as string[]) || QUESTIONAIRES.map(() => "")
  );
  const [attachDeckValue, setAttachDeckValue] = useState(attach_deck || "");
  const [companyNameValue, setCompanyNameValue] = useState(company_name || "");
  const [registeredCountryValue, setRegisteredCountryValue] = useState(
    registered_country || ""
  );
  const [companyRegistrationNumberValue, setCompanyRegistrationNumberValue] =
    useState(company_registration_number || "");
  const [companyAddressStreetValue, setCompanyAddressStreetValue] = useState(
    company_address_street || ""
  );
  const [companyAddressNumberValue, setCompanyAddressNumberValue] = useState(
    company_address_number || ""
  );
  const [companyAddressCityValue, setCompanyAddressCityValue] = useState(
    company_address_city || ""
  );
  const [companyAddressZipValue, setCompanyAddressZipValue] = useState(
    company_address_zip || ""
  );
  const [paymentPreferenceValue, setPaymentPreferenceValue] = useState(
    payment_preference || ""
  );
  return (
    <Box sx={{ maxWidth: "600px" }}>
      <H1>Setup your fundraising profile</H1>
      <H4>Contact Details</H4>
      <TextField
        sx={{ mb: 2 }}
        value={firstNameValue}
        onChange={(e) => setFirstNameValue(e.target.value)}
        label={"First Name"}
        required
        fullWidth
      />
      <Box sx={{ width: "100%" }}>
        <TextField
          sx={{ mb: 2 }}
          value={lastNameValue}
          onChange={(e) => setLastNameValue(e.target.value)}
          label={"Last Name"}
          required
        />
        <TextField
          sx={{ ml: 2 }}
          value={middleNameValue}
          onChange={(e) => setMiddleNameValue(e.target.value)}
          label={"Middle Name"}
        />
      </Box>
      <TextField
        sx={{ mb: 2 }}
        value={contactEmailValue}
        helperText={"visible to investors"}
        onChange={(e) => setContactEmailValue(e.target.value)}
        required
        label={"Contact Email"}
        fullWidth
      />
      <Box>
        <FormLabel required>Profile Picture</FormLabel>
      </Box>
      <Box sx={{ mb: 2 }}>
        <img
          src={profileImageUrl}
          alt={"Profile Image"}
          style={{ borderRadius: "4px" }}
          width={129}
          height={129}
        />
      </Box>
      <FormLabel sx={{ mt: 2, mb: 1 }}>Social Profiles</FormLabel>
      {SOCIAL_PROFILES.map(({ icon }, i) => (
        <SocialProfile
          key={i}
          icon={icon}
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
      <H4>Why should people invest in you?</H4>
      {QUESTIONAIRES.map(({ q }, i) => (
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
      ))}
      <TextField
        value={attachDeckValue}
        onChange={(e) => setAttachDeckValue(e.target.value)}
        placeholder="https://"
        label={"Attach Deck"}
        sx={{ mb: 2 }}
        fullWidth
      />
      <H4>Legal Information</H4>
      <Body sx={{ mt: 0, mb: 2 }}>
        You must have a registered company to be able to use this service. If
        you do not, there are fast ways to open up a company.{" "}
        <ExternalLink href={"https://stripe.com/atlas"}>
          Learn More.
        </ExternalLink>
      </Body>
      <TextField
        label={"Company Name"}
        value={companyNameValue}
        onChange={(e) => setCompanyNameValue(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormLabel required>Registered Country</FormLabel>
      <Select
        value={registeredCountryValue}
        maxRows={10}
        sx={{ mb: 2 }}
        MenuProps={{ sx: { maxHeight: 200 } }}
        onChange={(e) => setRegisteredCountryValue(e.target.value)}
        fullWidth
      >
        {CountryRegionData.map((c) => (
          <MenuItem value={c.countryName} key={c.countryShortCode}>
            {c.countryName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label={"Company Registration Number"}
        value={companyRegistrationNumberValue}
        onChange={(e) => setCompanyRegistrationNumberValue(e.target.value)}
        required
        sx={{ mb: 2 }}
        fullWidth
      />
      <Box sx={{ mb: 2 }}>
        <TextField
          label={"Street"}
          value={companyAddressStreetValue}
          onChange={(e) => setCompanyAddressStreetValue(e.target.value)}
          required
        />
        <TextField
          sx={{ ml: 2 }}
          label={"No"}
          value={companyAddressNumberValue}
          onChange={(e) => setCompanyAddressNumberValue(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label={"City"}
          value={companyAddressCityValue}
          onChange={(e) => setCompanyAddressCityValue(e.target.value)}
          required
        />
        <TextField
          sx={{ ml: 2 }}
          label={"Zip"}
          value={companyAddressZipValue}
          onChange={(e) => setCompanyAddressZipValue(e.target.value)}
          required
        />
      </Box>
      <H4>Payment Preferences</H4>
      <Body sx={{ mt: 0, mb: 2 }}>How do you want to be paid?</Body>
      <RadioGroup
        sx={{ mb: 2 }}
        value={paymentPreferenceValue}
        onChange={(e) => setPaymentPreferenceValue(e.target.value)}
      >
        {PAYMENT_PREFERENCES.map(({ label }, key) => (
          <Box sx={{ display: "flex", alignItems: "center" }} key={key}>
            <Radio value={label} sx={{ mx: 1 }} />
            {label}
          </Box>
        ))}
      </RadioGroup>
      <Box sx={{ alignItems: "center", display: "flex" }}>
        <Button
          onClick={() => {
            setLoading(true);
            update({
              firstName: firstNameValue,
              lastName: lastNameValue,
              unsafeMetadata: {
                ...rest,
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
                completed: true,
              },
            }).finally(() => setLoading(false));
          }}
          variant={"contained"}
          sx={{ mr: 2 }}
        >
          Save Edits
        </Button>
        {loading && <CircularProgress size={20} />}
      </Box>
    </Box>
  );
};

const FundraiseContent = ({ setTab }: { setTab: (t: number) => void }) => {
  const {
    unsafeMetadata: { completed = false },
  } = useUser();
  const [rows, setRows] = useState<
    Awaited<ReturnType<GetHandler>>["fundraises"]
  >([]);
  const getFundraises = useAuthenticatedHandler({
    path: "fundraises",
    method: "GET",
  });
  useEffect(() => {
    getFundraises().then((r) => setRows(r.fundraises));
  }, [getFundraises, setRows]);
  return (
    <Box sx={{ maxWidth: 1000 }}>
      <H1
        sx={{
          fontSize: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Your Fundraises
        {!!rows.length && (
          <Button variant={"contained"}>Start New Fundraise</Button>
        )}
      </H1>
      {completed ? (
        <>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fundraising Type</TableCell>
                <TableCell>Fundraising Progress</TableCell>
                <TableCell># Investors</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.uuid}>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.progress}</TableCell>
                  <TableCell>{row.investorCount}</TableCell>
                  <TableCell>
                    <Button variant="outlined">Invite Investor</Button>
                    <IconButton>
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!rows.length && (
            <Box sx={{ mt: 4 }} textAlign={"center"}>
              <H4>Set up your first fundraise</H4>
              <Button variant={"contained"}>Start New Fundraise</Button>
            </Box>
          )}
        </>
      ) : (
        <Body>
          <Link onClick={() => setTab(0)} sx={{ cursor: "pointer" }}>
            Setup your profile
          </Link>{" "}
          in order to start fundraising.
        </Body>
      )}
    </Box>
  );
};

const DRAWER_WIDTH = 255;
const TABS = [
  { text: "My Profile", Icon: HomeIcon, content: ProfileContent },
  {
    text: "My Fundraises",
    Icon: ContractIcon,
    content: FundraiseContent,
  },
  {
    text: "Settings",
    Icon: SettingsIcon,
    content: () => <div>Coming Soon!</div>,
  },
] as const;

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const TabContent = TABS[tab].content;
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          backgroundColor: themeProps.background,
        }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
          <UserButton />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#363740",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Link href="/">Home</Link>
        </Toolbar>
        <List>
          {TABS.map(({ text, Icon }, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                setTab(index);
              }}
              sx={{
                display: "flex",
                background: index === tab ? "#0000000a" : "unset",
                borderLeft: index === tab ? "2px solid #DDE2FF" : "unset",
                paddingLeft: "32px",
                py: "20px",
                fontSize: 14,
                color: "#A4A6B3",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          pb: 2,
          color: "text.primary",
          height: "fit-content",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        <Toolbar />
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <TabContent setTab={setTab} />
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
    <SignedIn>
      <Dashboard />
    </SignedIn>
    <RedirectToLogin />
  </Document>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"User"} styles={clerkUserProfileCss} />
);
export default UserPage;
