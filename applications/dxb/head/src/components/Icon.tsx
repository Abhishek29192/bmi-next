import IconComponent from "@bmi-digital/components/icon/Icon";
import Arrow from "@bmi-digital/components/icon/Arrow";
import Article from "@bmi-digital/components/icon/Article";
import Box from "@bmi-digital/components/icon/Box";
import Calender from "@bmi-digital/components/icon/Calender";
import CertificationFlatRoof from "@bmi-digital/components/icon/CertificationFlatRoof";
import CertificationOtherTraining from "@bmi-digital/components/icon/CertificationOtherTraining";
import CertificationPitchedRoof from "@bmi-digital/components/icon/CertificationPitchedRoof";
import CopyContent from "@bmi-digital/components/icon/CopyContent";
import Cross from "@bmi-digital/components/icon/Cross";
import Cube from "@bmi-digital/components/icon/Cube";
import Design from "@bmi-digital/components/icon/Design";
import Download from "@bmi-digital/components/icon/Download";
import ExternalDocument from "@bmi-digital/components/icon/ExternalDocument";
import ExternalLink from "@bmi-digital/components/icon/ExternalLink";
import Facebook from "@bmi-digital/components/icon/Facebook";
import FileDOCX from "@bmi-digital/components/icon/FileDocx";
import FileJPEG from "@bmi-digital/components/icon/FileJpeg";
import FileJPG from "@bmi-digital/components/icon/FileJpg";
import FilePDF from "@bmi-digital/components/icon/FilePdf";
import FilePNG from "@bmi-digital/components/icon/FilePng";
import FileSVG from "@bmi-digital/components/icon/FileSvg";
import FileTXT from "@bmi-digital/components/icon/FileTxt";
import FileUniversal from "@bmi-digital/components/icon/FileUniversal";
import FileXLSX from "@bmi-digital/components/icon/FileXlsx";
import FileZIP from "@bmi-digital/components/icon/FileZip";
import Filter from "@bmi-digital/components/icon/Filter";
import FlatRoof from "@bmi-digital/components/icon/FlatRoof";
import Folder from "@bmi-digital/components/icon/Folder";
import FolderZip from "@bmi-digital/components/icon/FolderZip";
import HardHatHead from "@bmi-digital/components/icon/HardHatHead";
import Heart from "@bmi-digital/components/icon/Heart";
import Instagram from "@bmi-digital/components/icon/Instagram";
import Laptop from "@bmi-digital/components/icon/Laptop";
import LinkedIn from "@bmi-digital/components/icon/LinkedIn";
import Mail from "@bmi-digital/components/icon/Mail";
import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import Phone from "@bmi-digital/components/icon/Phone";
import PhoneMobile from "@bmi-digital/components/icon/PhoneMobile";
import PitchedRoof from "@bmi-digital/components/icon/PitchedRoof";
import Place from "@bmi-digital/components/icon/Place";
import PlayArrow from "@bmi-digital/components/icon/PlayArrow";
import QuestionMark from "@bmi-digital/components/icon/QuestionMark";
import SelectRoof from "@bmi-digital/components/icon/SelectRoof";
import SelectTile from "@bmi-digital/components/icon/SelectTile";
import SelectWallColour from "@bmi-digital/components/icon/SelectWallColour";
import Star from "@bmi-digital/components/icon/Star";
import ThumbUp from "@bmi-digital/components/icon/ThumbUp";
import Tile from "@bmi-digital/components/icon/Tile";
import TileColour from "@bmi-digital/components/icon/TileColour";
import TollOutlined from "@bmi-digital/components/icon/TollOutlined";
import Twitter from "@bmi-digital/components/icon/Twitter";
import User from "@bmi-digital/components/icon/User";
import YouTube from "@bmi-digital/components/icon/YouTube";
import React from "react";
import { Logo, getLogo } from "./BrandLogo";
import type { IconProps } from "@bmi-digital/components/icon";

export type IconName =
  | Logo
  | "Article"
  | "Arrow"
  | "ArrowBack"
  | "ArrowForward"
  | "Box"
  | "Calender"
  | "TollOutlined"
  | "CopyContent"
  | "Download"
  | "Facebook"
  | "Folder"
  | "LinkedIn"
  | "Twitter"
  | "Instagram"
  | "Mail"
  | "Phone"
  | "PhoneMobile"
  | "QuestionMark"
  | "User"
  | "YouTube"
  | "FileDOCX"
  | "FileJPEG"
  | "FileJPG"
  | "FilePDF"
  | "FilePNG"
  | "FileSVG"
  | "FileTXT"
  | "FileUniversal"
  | "FileXLSX"
  | "FileZIP"
  | "Filter"
  | "GetApp"
  | "Cross"
  | "Design"
  | "ExternalDocument"
  | "ExternalLink"
  | "HardHatHead"
  | "Place"
  | "PlayArrow"
  | "Tile"
  | "TileColour"
  | "SelectRoof"
  | "SelectTile"
  | "SelectWallColour"
  | "CertificationFlatRoof"
  | "CertificationOtherTraining"
  | "CertificationPitchedRoof"
  | "FlatRoof"
  | "OtherTraining"
  | "PitchedRoof"
  | "FolderZip"
  | "Cube"
  | "Laptop";

const getIcon = (icon: string) => {
  const logo = getLogo(icon);
  if (logo) {
    return logo;
  }
  switch (icon) {
    case "Article":
      return Article;
    case "Arrow":
      return Arrow;
    case "Box":
      return Box;
    case "Download":
      return Download;
    case "Calender":
      return Calender;
    case "TollOutlined":
      return TollOutlined;
    case "CopyContent":
      return CopyContent;
    case "Facebook":
      return Facebook;
    case "Folder":
      return Folder;
    case "Heart":
      return Heart;
    case "LinkedIn":
      return LinkedIn;
    case "Twitter":
      return Twitter;
    case "Instagram":
      return Instagram;
    case "Mail":
      return Mail;
    case "Phone":
      return Phone;
    case "PhoneMobile":
      return PhoneMobile;
    case "QuestionMark":
      return QuestionMark;
    case "User":
      return User;
    case "YouTube":
      return YouTube;
    case "FileDOCX":
      return FileDOCX;
    case "FileJPEG":
      return FileJPEG;
    case "FileJPG":
      return FileJPG;
    case "FilePDF":
      return FilePDF;
    case "FilePNG":
      return FilePNG;
    case "FileSVG":
      return FileSVG;
    case "FileTXT":
      return FileTXT;
    case "FileUniversal":
      return FileUniversal;
    case "FileXLSX":
      return FileXLSX;
    case "FileZIP":
      return FileZIP;
    case "Filter":
      return Filter;
    case "Cross":
      return Cross;
    case "Design":
      return Design;
    case "ExternalDocument":
      return ExternalDocument;
    case "ExternalLink":
      return ExternalLink;
    case "HardHatHead":
      return HardHatHead;
    case "Place":
      return Place;
    case "PlayArrow":
      return PlayArrow;
    case "Tile":
      return Tile;
    case "TileColour":
      return TileColour;
    case "ThumbUp":
      return ThumbUp;
    case "SelectRoof":
      return SelectRoof;
    case "SelectTile":
      return SelectTile;
    case "SelectWallColour":
      return SelectWallColour;
    case "Star":
      return Star;
    case "CertificationFlatRoof":
      return CertificationFlatRoof;
    case "CertificationOtherTraining":
      return CertificationOtherTraining;
    case "CertificationPitchedRoof":
      return CertificationPitchedRoof;
    case "FlatRoof":
      return FlatRoof;
    case "OtherTraining":
      return OtherTraining;
    case "PitchedRoof":
      return PitchedRoof;
    case "FolderZip":
      return FolderZip;
    case "Cube":
      return Cube;
    case "Laptop":
      return Laptop;
    default:
      return undefined;
  }
};

const Icon = ({
  name,
  ...props
}: { name: IconName } & Omit<IconProps, "source" | "ref">) => {
  const icon = getIcon(name);
  return icon ? <IconComponent source={icon} {...props} /> : null;
};

export default Icon;
