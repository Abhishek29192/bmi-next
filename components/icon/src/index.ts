import {
  Help as QuestionMark,
  Mail,
  Person as User,
  Phone,
  PhoneIphone as PhoneMobile,
  PlayArrow
} from "@material-ui/icons";
import Icon from "./Icon";
import Arrow from "./svgs/Arrow.svg";
import Download from "./svgs/Download.svg";
import Facebook from "./svgs/Facebook.svg";
import LinkedIn from "./svgs/LinkedIn.svg";
import YouTube from "./svgs/YouTube.svg";
import FileJPEG from "./svgs/FileJPEG.svg";
import FileJPG from "./svgs/FileJPG.svg";
import FilePDF from "./svgs/FilePDF.svg";
import FilePNG from "./svgs/FilePNG.svg";
import Cross from "./svgs/Cross.svg";
import External from "./svgs/External.svg";
import HardHatHead from "./svgs/HardHatHead.svg";
import LocationOn from "./svgs/LocationOn.svg";
import TileColour from "./svgs/TileColour.svg";
import SelectRoof from "./svgs/SelectRoof.svg";
import SelectTile from "./svgs/SelectTile.svg";
import SelectWallColour from "./svgs/SelectWallColour.svg";

export {
  Arrow,
  Download,
  Facebook,
  LinkedIn,
  Mail,
  Phone,
  PhoneMobile,
  QuestionMark,
  User,
  YouTube,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  Cross,
  External,
  HardHatHead,
  LocationOn,
  PlayArrow,
  TileColour,
  SelectRoof,
  SelectTile,
  SelectWallColour
};

export const iconMap = {
  Arrow,
  Download,
  Facebook,
  LinkedIn,
  Mail,
  Phone,
  PhoneMobile,
  QuestionMark,
  User,
  YouTube,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  Cross,
  External,
  HardHatHead,
  LocationOn,
  PlayArrow,
  TileColour,
  SelectRoof,
  SelectTile,
  SelectWallColour
};

export type IconName = keyof typeof iconMap;

export default Icon;
