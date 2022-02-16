import { themeProps } from "./Layout";
import styled from "styled-components";

import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
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
const personFine = require("./Icons/personFine.svg")
const home = require("./Icons/personFine.svg")
const fundraise = require("./Icons/rocket.svg")
const settings = require("./Icons/settings.svg")
const dollar = require("./Icons/dollar.svg")
const mail = require("./Icons/mail.svg")
const book = require("./Icons/book.svg")

const Icon = ({
  name,
  color,
  heightAndWidth,
  ...props
}: {
  heightAndWidth: string,
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
  | "twitter"
  | "personFine"
  | "fundraise"
  | "dollar"
  | "book"
  | "mail"
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
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={home} />;
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
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={settings} />;
    case "twitter":
      return <TwitterIcon {...props} />;
    case "fundraise":
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={fundraise} />;
    case "personFine":
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={personFine} />;
    case "dollar":
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={dollar} />;
    case "mail":
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={mail} />;
    case "book":
      return <StyledIcon color={color} heightAndWidth={heightAndWidth} icon={book} />;
    default:
      return <SvgIcon {...props} />;
  }
};

const StyledIcon = styled.div<{
  icon?: any
  height?: string
  width?: string
  color?: string
  hoverOff?: boolean
  heightAndWidth?: string
  rotation?: number
}>`
  cursor: ${(props) => (props.hoverOff ? 'default' : 'pointer')};
  height: ${(props) => props.heightAndWidth ? props.heightAndWidth : props.height};
  width: ${(props) => props.heightAndWidth ? props.heightAndWidth : props.width};
  background-color: ${(props) =>
    props.color
      ? themeProps.palette.color[props.color]
      : themeProps.palette.color['iconColor']};
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-image: url(${(props) => props.icon ?? props.icon});
`

export default Icon;
