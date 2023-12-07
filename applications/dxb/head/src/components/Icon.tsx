import IconComponent, {
  Arrow,
  Article,
  Box,
  Calender,
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof,
  CopyContent,
  Price,
  Cross,
  Cube,
  Design,
  Download,
  ExternalDocument,
  ExternalLink,
  Facebook,
  FileDOCX,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  FileSVG,
  FileTXT,
  FileUniversal,
  FileXLSX,
  FileZIP,
  Filter,
  FlatRoof,
  Folder,
  FolderZip,
  HardHatHead,
  Heart,
  IconProps,
  Instagram,
  LinkedIn,
  Place,
  Mail,
  OtherTraining,
  Phone,
  PhoneMobile,
  PitchedRoof,
  PlayArrow,
  QuestionMark,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  Star,
  ThumbUp,
  Tile,
  TileColour,
  Twitter,
  User,
  YouTube
} from "@bmi-digital/components/icon";
import React from "react";
import { getLogo, Logo } from "./BrandLogo";

export type IconName =
  | Logo
  | "Article"
  | "Arrow"
  | "ArrowBack"
  | "ArrowForward"
  | "Box"
  | "Calender"
  | "Price"
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
  | "Cube";

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
    case "Price":
      return Price;
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
