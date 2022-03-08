import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MoneyIcon from "@mui/icons-material/Money";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteIcon from "@mui/icons-material/Note";
import PreviewIcon from "@mui/icons-material/Preview";
import PublicIcon from "@mui/icons-material/Public";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";

import BookSvg from "./Icons/book.svg";
import DollarSvg from "./Icons/dollar.svg";
import Globe from "./Icons/globe.svg";
import PersonFineSvg from "./Icons/personFine.svg";
import MailSvg from "./Icons/mail.svg";
import RocketSvg from "./Icons/rocket.svg";
import SettingsSvg from "./Icons/settings.svg";
import ThumbsUp from "./Icons/thumbsUp.svg";
import Repeat from "./Icons/repeat.svg";
import Split from "./Icons/split.svg";
import TrendingUp from "./Icons/trendingUp.svg";
import Remove from "./Icons/close.svg";
import BackArrow from "./Icons/backArrow.svg";
import Edit from "./Icons/edit.svg";

const Icon = ({
  name,
  heightAndWidth,
  ...inputProps
}: {
  heightAndWidth?: string;
  color?: string;
  name:
    | "arrow-drop-down"
    | "arrow-right"
    | "book"
    | "check"
    | "delete"
    | "dollar"
    | "email"
    | "facebook"
    | "fundraise"
    | "github"
    | "globe"
    | "home"
    | "info"
    | "Instagram"
    | "linkedIn"
    | "mail"
    | "money"
    | "more-vert"
    | "note"
    | "personFine"
    | "preview"
    | "public"
    | "reddit"
    | "repeat"
    | "settings"
    | "split"
    | "thumbsUp"
    | "trendingUp"
    | "twitter"
    | "webIcon"
    | "youtube"
    | "remove"
    | "backArrow"
    | "edit";
} & Pick<SvgIconProps, "height" | "width">) => {
  const muiProps = {
    ...inputProps,
    color: inputProps.color as SvgIconProps["color"],
  };
  const props = {
    ...inputProps,
    $heightAndWidth: heightAndWidth,
  };
  switch (name) {
    case "arrow-drop-down":
      return <ArrowDropDownIcon {...muiProps} />;
    case "arrow-right":
      return <ArrowRightIcon {...muiProps} />;
    case "book":
      return <StyledIcon {...props} icon={BookSvg} />;
    case "check":
      return <CheckIcon {...muiProps} />;
    case "delete":
      return <DeleteIcon {...muiProps} />;
    case "dollar":
      return <StyledIcon {...props} icon={DollarSvg} />;
    case "email":
      return <EmailIcon {...muiProps} />;
    case "facebook":
      return <FacebookIcon {...muiProps} />;
    case "fundraise":
      return <StyledIcon {...props} icon={RocketSvg} />;
    case "github":
      return <GitHubIcon {...muiProps} />;
    case "globe":
      return <StyledIcon {...props} icon={Globe} />;
    case "home":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "info":
      return <InfoIcon {...muiProps} />;
    case "Instagram":
      return <InstagramIcon {...muiProps} />;
    case "linkedIn":
      return <LinkedInIcon {...muiProps} />;
    case "mail":
      return <StyledIcon {...props} icon={MailSvg} />;
    case "money":
      return <MoneyIcon {...muiProps} />;
    case "more-vert":
      return <MoreVertIcon {...muiProps} />;
    case "note":
      return <NoteIcon {...muiProps} />;
    case "personFine":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "preview":
      return <PreviewIcon {...muiProps} />;
    case "public":
      return <PublicIcon {...muiProps} />;
    case "reddit":
      return <RedditIcon {...muiProps} />;
    case "repeat":
      return <StyledIcon {...props} icon={Repeat} />;
    case "settings":
      return <StyledIcon {...props} icon={SettingsSvg} />;
    case "split":
      return <StyledIcon {...props} icon={Split} />;
    case "thumbsUp":
      return <StyledIcon {...props} icon={ThumbsUp} />;
    case "trendingUp":
      return <StyledIcon {...props} icon={TrendingUp} />;
    case "twitter":
      return <TwitterIcon {...muiProps} />;
    case "webIcon":
      return <PublicIcon {...muiProps} />;
    case "youtube":
      return <YoutubeIcon {...muiProps} />;
    case "remove":
      return <StyledIcon {...props} icon={Remove} />;
    case "backArrow":
      return <StyledIcon {...props} icon={BackArrow} />;
    case "edit":
      return <StyledIcon {...props} icon={Edit} />;
    default:
      return <SvgIcon {...muiProps} />;
  }
};

const StyledIcon = styled.div<{
  icon?: any;
  height?: string | number;
  width?: string | number;
  color?: string;
  hoverOff?: boolean;
  $heightAndWidth?: string;
  rotation?: number;
}>`
  cursor: ${(props) => (props.hoverOff ? "default" : "pointer")};
  height: ${(props) =>
    props.$heightAndWidth ? props.$heightAndWidth : props.height};
  width: ${(props) =>
    props.$heightAndWidth ? props.$heightAndWidth : props.width};
  background-color: ${(props) =>
    props.color
      ? props.theme.palette.color[props.color]
      : props.theme.palette.color["iconColor"]};
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-image: url(${(props) => props.icon ?? props.icon});
`;

export default Icon;
