import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import FacebookIcon from "@mui/icons-material/Facebook";
import InfoIcon from "@mui/icons-material/Info";
import InstagramIcon from "@mui/icons-material/Instagram";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteIcon from "@mui/icons-material/Note";
import PreviewIcon from "@mui/icons-material/Preview";
import RedditIcon from "@mui/icons-material/Reddit";

import BookSvg from "./Icons/book.svg";
import CameraSvg from "./Icons/camera.svg";
import DollarSvg from "./Icons/dollar.svg";
import GitHubSvg from "./Icons/github.svg";
import Globe from "./Icons/globe.svg";
import ImageDefaultSvg from "./Icons/image-default.svg";
import LinkedInSvg from "./Icons/linkedin.svg";
import PersonFineSvg from "./Icons/personFine.svg";
import MailSvg from "./Icons/mail.svg";
import RocketSvg from "./Icons/rocket.svg";
import PublicSvg from "./Icons/globe.svg";
import TwitterSvg from "./Icons/twitter.svg";
import SettingsSvg from "./Icons/settings.svg";
import ThumbsUp from "./Icons/thumbsUp.svg";
import Repeat from "./Icons/repeat.svg";
import Split from "./Icons/split.svg";
import TrendingUp from "./Icons/trendingUp.svg";
import Remove from "./Icons/close.svg";
import BackArrow from "./Icons/backArrow.svg";
import Edit from "./Icons/edit.svg";
import Monitor from "./Icons/monitor.svg";
import Youtube from "./Icons/youtube.svg";
import bank from "./Icons/bank.svg";
import ethereum from "./Icons/ethereum.svg";
import bitcoin from "./Icons/bitcoin.svg";
import paypalSmall from "./Icons/paypalSmall.svg";
import near from "./Icons/near.svg";
import UploadSvg from "./Icons/upload.svg";

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
    | "camera"
    | "check"
    | "delete"
    | "dollar"
    | "email"
    | "facebook"
    | "fundraise"
    | "github"
    | "globe"
    | "home"
    | "image-default"
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
    | "remove"
    | "backArrow"
    | "edit"
    | "monitor"
    | "ethereum"
    | "near"
    | "bitcoin"
    | "bank"
    | "paypalSmall"
    | "upload"
    | "youtube";
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
    case "camera":
      return <StyledIcon {...props} icon={CameraSvg} />;
    case "check":
      return <CheckIcon {...muiProps} />;
    case "delete":
      return <DeleteIcon {...muiProps} />;
    case "dollar":
      return <StyledIcon {...props} icon={DollarSvg} />;
    case "email":
      return <StyledIcon {...props} icon={MailSvg} />;
    case "facebook":
      return <FacebookIcon {...muiProps} />;
    case "fundraise":
      return <StyledIcon {...props} icon={RocketSvg} />;
    case "github":
      return <StyledIcon {...props} icon={GitHubSvg} />;
    case "globe":
      return <StyledIcon {...props} icon={Globe} />;
    case "home":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "image-default":
      return <StyledIcon {...props} icon={ImageDefaultSvg} />;
    case "info":
      return <InfoIcon {...muiProps} />;
    case "Instagram":
      return <InstagramIcon {...muiProps} />;
    case "linkedIn":
      return <StyledIcon {...props} icon={LinkedInSvg} />;
    case "mail":
      return <StyledIcon {...props} icon={MailSvg} />;
    case "money":
      return <StyledIcon {...props} icon={DollarSvg} />;
    case "more-vert":
      return <MoreVertIcon {...muiProps} />;
    case "note":
      return <NoteIcon {...muiProps} />;
    case "personFine":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "preview":
      return <PreviewIcon {...muiProps} />;
    case "public":
      return <StyledIcon {...props} icon={PublicSvg} />;
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
      return <StyledIcon {...props} icon={TwitterSvg} />;
    case "upload":
      return <StyledIcon {...props} icon={UploadSvg} />;
    case "webIcon":
      return <StyledIcon {...props} icon={Globe} />;
    case "remove":
      return <StyledIcon {...props} icon={Remove} />;
    case "backArrow":
      return <StyledIcon {...props} icon={BackArrow} />;
    case "edit":
      return <StyledIcon {...props} icon={Edit} />;
    case "monitor":
      return <StyledIcon {...props} icon={Monitor} />;
    case "youtube":
      return <StyledIcon {...props} icon={Youtube} />;
    case "near":
      return <StyledIcon {...props} icon={near} />;
    case "bank":
      return <StyledIcon {...props} icon={bank} />;
    case "paypalSmall":
      return <StyledIcon {...props} icon={paypalSmall} />;
    case "bitcoin":
      return <StyledIcon {...props} icon={bitcoin} />;
    case "ethereum":
      return <StyledIcon {...props} icon={ethereum} />;
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
