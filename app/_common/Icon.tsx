import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteIcon from "@mui/icons-material/Note";
import PreviewIcon from "@mui/icons-material/Preview";
import PublicIcon from "@mui/icons-material/Public";
import TwitterIcon from "@mui/icons-material/Twitter";

import BookSvg from "./Icons/book.svg";
import DollarSvg from "./Icons/dollar.svg";
import PersonFineSvg from "./Icons/personFine.svg";
import MailSvg from "./Icons/mail.svg";
import RocketSvg from "./Icons/rocket.svg";
import SettingsSvg from "./Icons/settings.svg";
import ThumbsUp from "./Icons/thumbsUp.svg";
import Repeat from "./Icons/repeat.svg";
import Split from "./Icons/split.svg";
import TrendingUp from "./Icons/trendingUp.svg";
import Globe from "./Icons/globe.svg";

const Icon = ({
  name,
  ...props
}: {
  heightAndWidth?: string,
  color?: string,
  name:
  | "arrow-drop-down"
  | "arrow-right"
  | "book"
  | "check"
  | "delete"
  | "dollar"
  | "fundraise"
  | "github"
  | "home"
  | "info"
  | "mail"
  | "more-vert"
  | "note"
  | "personFine"
  | "preview"
  | "public"
  | "settings"
  | "twitter"
  | "thumbsUp"
  | "repeat"
  | "split"
  | "trendingUp"
  | "linkedIn"
  | "Instagram"
  | "facebook"
  | "reddit"
  | "youtube"
  | "email"
  | "webIcon"
} & Pick<SvgIconProps, "height" | "width">) => {
  const muiProps = {
    ...props,
    color: props.color as SvgIconProps['color'],
  }
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
    case "fundraise":
      return <StyledIcon {...props} icon={RocketSvg} />;
    case "github":
      return <GitHubIcon {...muiProps} />;
    case "home":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "info":
      return <InfoIcon {...muiProps} />;
    case "linkedin":
      return <LinkedInIcon {...muiProps} />;
    case "mail":
      return <StyledIcon {...props} icon={MailSvg} />;
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
    case "settings":
      return <StyledIcon {...props} icon={SettingsSvg} />;
    case "twitter":
      return <TwitterIcon {...muiProps} />;
    case "thumbsUp":
      return <StyledIcon {...props} icon={ThumbsUp} />;
    case "repeat":
      return <StyledIcon {...props} icon={Repeat} />;
    case "split":
      return <StyledIcon {...props} icon={Split} />;
    case "trendingUp":
      return <StyledIcon {...props} icon={TrendingUp} />;
    case "webIcon":
      return <PublicIcon {...muiProps} />;
    default:
      return <SvgIcon {...muiProps} />;
  }
};

const StyledIcon = styled.div<{
  icon?: any,
  height?: string | number,
  width?: string | number,
  color?: string,
  hoverOff?: boolean,
  heightAndWidth?: string,
  rotation?: number,
}>`
  cursor: ${(props) => (props.hoverOff ? 'default' : 'pointer')};
  height: ${(props) => props.heightAndWidth ? props.heightAndWidth : props.height};
  width: ${(props) => props.heightAndWidth ? props.heightAndWidth : props.width};
  background-color: ${(props) =>
    props.color
      ? props.theme.palette.color[props.color]
      : props.theme.palette.color['iconColor']};
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-image: url(${(props) => props.icon ?? props.icon});
`

export default Icon;
