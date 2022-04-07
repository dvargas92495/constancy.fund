import styled from "styled-components";
import AddSvg from "./Icons/Add.svg";
import ArrowDropDownSvg from "./Icons/arrow-drop-down.svg";
import ArrowRightSvg from "./Icons/arrow-right.svg";
import BookSvg from "./Icons/book.svg";
import CheckSvg from "./Icons/Check.svg";
import CameraSvg from "./Icons/camera.svg";
import DeleteSvg from "./Icons/delete.svg";
import DollarSvg from "./Icons/dollar.svg";
import FacebookSvg from "./Icons/facebook.svg";
import GitHubSvg from "./Icons/github.svg";
import Globe from "./Icons/globe.svg";
import ImageDefaultSvg from "./Icons/image-default.svg";
import InfoSvg from "./Icons/info.svg";
import InstagramSvg from "./Icons/instagram.svg";
import LinkedInSvg from "./Icons/linkedin.svg";
import PersonFineSvg from "./Icons/personFine.svg";
import PreviewSvg from "./Icons/preview.svg";
import MailSvg from "./Icons/mail.svg";
import MoreVertSvg from "./Icons/more-vert.svg";
import NoteSvg from "./Icons/note.svg";
import RedditSvg from "./Icons/reddit.svg";
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
    | "add"
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
} & StyledIconProps) => {
  const props = {
    ...inputProps,
    $heightAndWidth: heightAndWidth,
  };
  switch (name) {
    case "add":
      return <StyledIcon icon={AddSvg} {...props} />;
    case "arrow-drop-down":
      return <StyledIcon icon={ArrowDropDownSvg} {...props} />;
    case "arrow-right":
      return <StyledIcon icon={ArrowRightSvg} {...props} />;
    case "book":
      return <StyledIcon {...props} icon={BookSvg} />;
    case "camera":
      return <StyledIcon {...props} icon={CameraSvg} />;
    case "check":
      return <StyledIcon {...props} icon={CheckSvg} />;
    case "delete":
      return <StyledIcon {...props} icon={DeleteSvg} />;
    case "dollar":
      return <StyledIcon {...props} icon={DollarSvg} />;
    case "email":
      return <StyledIcon {...props} icon={MailSvg} />;
    case "facebook":
      return <StyledIcon {...props} icon={FacebookSvg} />;
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
      return <StyledIcon {...props} icon={InfoSvg} />;
    case "Instagram":
      return <StyledIcon {...props} icon={InstagramSvg} />;
    case "linkedIn":
      return <StyledIcon {...props} icon={LinkedInSvg} />;
    case "mail":
      return <StyledIcon {...props} icon={MailSvg} />;
    case "money":
      return <StyledIcon {...props} icon={DollarSvg} />;
    case "more-vert":
      return <StyledIcon {...props} icon={MoreVertSvg} />;
    case "note":
      return <StyledIcon {...props} icon={NoteSvg} />;
    case "personFine":
      return <StyledIcon {...props} icon={PersonFineSvg} />;
    case "preview":
      return <StyledIcon {...props} icon={PreviewSvg} />;
    case "public":
      return <StyledIcon {...props} icon={PublicSvg} />;
    case "reddit":
      return <StyledIcon {...props} icon={RedditSvg} />;
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
      return <svg />;
  }
};

type StyledIconProps = {
  icon?: any;
  height?: string | number;
  width?: string | number;
  color?: string;
  hoverOff?: boolean;
  $heightAndWidth?: string;
  rotation?: number;
};

const StyledIcon = styled.div<StyledIconProps>`
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
