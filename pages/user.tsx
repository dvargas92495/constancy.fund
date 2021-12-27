import { LayoutHead, themeProps } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import React, { useMemo, useEffect, useState, useCallback } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
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
import MoreIcon from "@mui/icons-material/MoreRounded";
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
import Card from "@mui/material/Card";
import type { Handler as GetHandler } from "../functions/fundraises/get";
import type { Handler as ContractHandler } from "../functions/contract/post";
import type { Handler as GetContractHandler } from "../functions/contract/get";
import type { Handler as DeleteHandler } from "../functions/contract/delete";
import type { Handler as PostAgreementHandler } from "../functions/agreement/post";
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
import FUNDRAISE_TYPES from "../db/fundraise_types";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import Skeleton from "@mui/material/Skeleton";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const H1 = (props: Parameters<typeof _H1>[0]) => (
  <_H1 sx={{ fontSize: 30, ...props.sx }} {...props} />
);

const H4 = (props: Parameters<typeof _H4>[0]) => (
  <_H4 sx={{ fontSize: 20, mt: 0, ...props.sx }} {...props} />
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
        value={paymentPreferenceValue || ""}
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

type Fundraises = Awaited<ReturnType<GetHandler>>["fundraises"];

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
  return (
    <TableRow>
      <TableCell>{row.type}</TableCell>
      <TableCell>
        {row.details
          .sort(({ label: a }, { label: b }) => a.localeCompare(b))
          .map((detail) => (
            <p key={detail.uuid}>
              <b>{detail.label}:</b> {detail.value}
            </p>
          ))}
      </TableCell>
      <TableCell>{row.progress}</TableCell>
      <TableCell>{row.investorCount}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          sx={{ marginRight: 1 }}
          onClick={() => {
            navigate(`/fundraises/contract/${row.uuid}`, {
              state: { open: true },
            });
          }}
        >
          Invite Investor
        </Button>
        <IconButton onClick={(e) => setIsOpen(e.target as HTMLButtonElement)}>
          <MoreIcon />
        </IconButton>
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
            <ListItem button onClick={onDelete} sx={{ display: "flex" }}>
              <ListItemIcon>
                <DeleteIcon />
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
    unsafeMetadata: { completed = false },
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
        Your Fundraises
        {!!rows.length && startFundraiseButton}
      </H1>
      {completed ? (
        <Container>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fundraising Type</TableCell>
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
              background: "#ffffff",
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
              {(Number(data["amount"]) || 0) * (Number(data["frequency"]) || 1)}
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
            startAdornment: (
              <InputAdornment position={"start"}>$</InputAdornment>
            ),
          }}
          name={"return"}
          value={data["return"]}
          onChange={onChange}
          label={"How much will your investors get back?"}
          helperText={<a>Get help on how to determine a fair return</a>}
        />{" "}
        <span>
          ={" "}
          {(100 * (Number(data["return"]) || 0)) /
            ((Number(data["amount"]) || 0) * (Number(data["frequency"]) || 1))}
          % return
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
        <span>= average {(Number(data["threshold"]) || 0) / 12} / month</span>
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
          /* In case performance is too bad
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
            .then((state) => navigate(`/fundraises/preview/${state.id}`))
            .catch((e) => {
              setError(e.message);
              setLoading(false);
            });
          e.preventDefault();
        }}
      >
        <DetailForm data={data} setData={setData} />
        <Box>
          <Button variant={"contained"} type={"submit"}>
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
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <>
      <H1>Step 3: Preview Contract</H1>
      <Box sx={{ height: "600px", marginBottom: "144px" }}>
        {/*<Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "50%",
          }}
        >
          <b>"explain me like I am 5" summary of the contract</b>
        </Box>*/}
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
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
            <Viewer
              fileUrl={`/_contracts/${id}/draft.pdf`}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
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
            navigate(`/fundraises/contract/${id}`, { state: { open: true } })
          }
        >
          Invite Investors
        </Button>
        {process.env.NODE_ENV === "development" && (
          <Button variant={"outlined"} color={"primary"}>
            Refresh PDF Preview
          </Button>
        )}
      </Box>
    </>
  );
};

type Agreements = Awaited<ReturnType<GetContractHandler>>["agreements"];

const AgreementRow = (row: Agreements[number]) => {
  return (
    <TableRow>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.amount}</TableCell>
      <TableCell>{row.stage}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

const FundraiseContract = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const getFundraise = useAuthenticatedHandler<GetContractHandler>({
    path: "contract",
    method: "GET",
  });
  const postAgreement = useAuthenticatedHandler<PostAgreementHandler>({
    path: "agreement",
    method: "POST",
  });
  const [rows, setRows] = useState<Agreements>([]);
  const { type: defaultType = FUNDRAISE_TYPES[0].id } = location.state || {};
  const [type, setType] = useState(defaultType);
  useEffect(() => {
    setLoading(true);
    getFundraise({ uuid: id })
      .then((r) => {
        setType(r.type);
        setRows(r.agreements);
      })
      .finally(() => setLoading(false));
  }, [id, setType, setRows, setLoading]);
  const Container: React.FC = loading
    ? ({ children }) => (
        <Skeleton variant={"rectangular"} sx={{ minHeight: "60vh" }}>
          {children}
        </Skeleton>
      )
    : Box;
  const defaultIsOpen = useMemo(() => location.state.isOpen, [location]);
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
              validate: (n) => (n < 0 ? "Amount must be greater than 0" : ""),
            },
          }}
          title={"Invite New Investor"}
          buttonText={"Invite Investor"}
          onSave={(body) =>
            postAgreement({ uuid: id, ...body }).then((r) =>
              setRows([...rows, { ...body, uuid: r.uuid, stage: 0 }])
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
              <AgreementRow key={row.uuid} {...row} />
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
    Icon: HomeIcon,
    content: ProfileContent,
    path: "",
    nested: [],
  },
  {
    text: "My Fundraises",
    Icon: ContractIcon,
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
    Icon: SettingsIcon,
    content: () => <div>Coming Soon!</div>,
    path: "settings",
    nested: [],
  },
] as const;

const DashboardTab = ({ path, Icon, text }: typeof TABS[number]) => {
  const location = useLocation();
  const isMatch = path
    ? location.pathname.startsWith(`/${path}`)
    : location.pathname === "/";
  return (
    <RRLink to={path}>
      <ListItem
        button
        key={path}
        sx={{
          display: "flex",
          background: isMatch ? "#0000000a" : "unset",
          borderLeft: isMatch ? "2px solid #DDE2FF" : "unset",
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
    </RRLink>
  );
};

const Dashboard = () => {
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
        <List
          sx={{
            a: {
              textDecoration: "none",
            },
          }}
        >
          {TABS.map((t) => (
            <DashboardTab {...t} key={t.path} />
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 8,
          pb: 2,
          color: "text.primary",
          height: "fit-content",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        <Toolbar />
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

export const Head = (): React.ReactElement => (
  <>
    <LayoutHead title={"User"} styles={clerkUserProfileCss} />
    <link rel="stylesheet" href="/user.css" />
  </>
);
export default UserPage;
