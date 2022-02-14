import type { SvgIconProps } from "@mui/material/SvgIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteIcon from "@mui/icons-material/Note";
import PreviewIcon from "@mui/icons-material/Preview";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import TwitterIcon from "@mui/icons-material/Twitter";

const Icon = ({
  name,
  ...props
}: {
  name:
    | "arrow-drop-down"
    | "arrow-right"
    | "delete"
    | "github"
    | "home"
    | "info"
    | "linkedin"
    | "more-vert"
    | "note"
    | "preview"
    | "public"
    | "settings"
    | "twitter";
} & SvgIconProps) => {
  switch (name) {
    case "arrow-drop-down":
      return <ArrowDropDownIcon {...props} />;
    case "arrow-right":
      return <ArrowRightIcon {...props} />;
    case "delete":
      return <DeleteIcon {...props} />;
    case "github":
      return <GitHubIcon {...props} />;
    case "home":
      return <HomeIcon {...props} />;
    case "info":
      return <InfoIcon {...props} />;
    case "linkedin":
      return <LinkedInIcon {...props} />;
    case "more-vert":
      return <MoreVertIcon {...props} />;
    case "note":
      return <NoteIcon {...props} />;
    case "preview":
      return <PreviewIcon {...props} />;
    case "public":
      return <PublicIcon {...props} />;
    case "settings":
      return <SettingsIcon {...props} />;
    case "twitter":
      return <TwitterIcon {...props} />;
  }
};

export default Icon;
