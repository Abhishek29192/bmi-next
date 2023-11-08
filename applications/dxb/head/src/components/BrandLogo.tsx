import Logo, {
  AeroDek,
  Awak,
  BMI,
  BMIAcademy,
  BMIAcademyDE,
  Braas,
  Bramac,
  Canopia,
  Cementegola,
  Cobert,
  Coverland,
  Esha,
  Everguard,
  Everlite,
  GuaranteeProduct,
  GuaranteeSolution,
  GuaranteeSystem,
  Icopal,
  IcopalKatto,
  IcopalVedag,
  Klober,
  Monarflex,
  Monarplan,
  Monier,
  Necoflex,
  Ormax,
  Redland,
  RoofPro,
  RoofProElite,
  RoofProExpert,
  RoofProPartner,
  RoofProPartnerSmall,
  RoofProServiceTeam,
  Sealoflex,
  SereniCoperture,
  Siplast,
  Standard,
  StandardCentred,
  Sunscape,
  Vedag,
  Villas,
  Wierer,
  Wolfin,
  Zanda
} from "@bmi-digital/components/logo";
import classnames from "classnames";
import React from "react";
import { LogoComponent, classes } from "./styles/BrandLogoStyles";

export type Logo =
  | "AeroDek"
  | "Awak"
  | "BMI"
  | "BMIAcademy"
  | "BMIAcademyEN"
  | "BMIAcademyDE"
  | "Braas"
  | "Bramac"
  | "Canopia"
  | "Cementegola"
  | "Cobert"
  | "Coverland"
  | "Esha"
  | "Everguard"
  | "Everlite"
  | "GuaranteeProduct"
  | "GuaranteeSolution"
  | "GuaranteeSystem"
  | "Icopal"
  | "IcopalKatto"
  | "IcopalVedag"
  | "Klober"
  | "Monarflex"
  | "Monarplan"
  | "Monier"
  | "Necoflex"
  | "Ormax"
  | "Redland"
  | "RoofPro"
  | "RoofProElite"
  | "RoofProExpert"
  | "RoofProPartner"
  | "RoofProPartnerSmall"
  | "RoofProServiceTeam"
  | "Sealoflex"
  | "SereniCoperture"
  | "Siplast"
  | "Standard"
  | "StandardCentred"
  | "Sunscape"
  | "Vedag"
  | "Villas"
  | "Wierer"
  | "Wolfin"
  | "Zanda"
  | string; // Handle PIM data
export const getLogo = (logo?: Logo | null) => {
  switch (logo) {
    case "AeroDek":
      return AeroDek;
    case "Awak":
      return Awak;
    case "BMI":
      return BMI;
    case "BMIAcademy":
    case "BMIAcademyEN":
      return BMIAcademy;
    case "BMIAcademyDE":
      return BMIAcademyDE;
    case "Braas":
      return Braas;
    case "Bramac":
      return Bramac;
    case "Canopia":
      return Canopia;
    case "Cementegola":
      return Cementegola;
    case "Cobert":
      return Cobert;
    case "Coverland":
      return Coverland;
    case "Esha":
      return Esha;
    case "Everguard":
      return Everguard;
    case "Everlite":
      return Everlite;
    case "GuaranteeProduct":
      return GuaranteeProduct;
    case "GuaranteeSolution":
      return GuaranteeSolution;
    case "GuaranteeSystem":
      return GuaranteeSystem;
    case "Icopal":
      return Icopal;
    case "IcopalKatto":
      return IcopalKatto;
    case "IcopalVedag":
      return IcopalVedag;
    case "Klober":
      return Klober;
    case "Monarflex":
      return Monarflex;
    case "Monarplan":
      return Monarplan;
    case "Monier":
      return Monier;
    case "Necoflex":
      return Necoflex;
    case "Ormax":
      return Ormax;
    case "Redland":
      return Redland;
    case "RoofPro":
      return RoofPro;
    case "RoofProElite":
      return RoofProElite;
    case "RoofProExpert":
      return RoofProExpert;
    case "RoofProPartner":
      return RoofProPartner;
    case "RoofProPartnerSmall":
      return RoofProPartnerSmall;
    case "RoofProServiceTeam":
      return RoofProServiceTeam;
    case "Sealoflex":
      return Sealoflex;
    case "SereniCoperture":
      return SereniCoperture;
    case "Siplast":
      return Siplast;
    case "Standard":
      return Standard;
    case "StandardCentred":
      return StandardCentred;
    case "Sunscape":
      return Sunscape;
    case "Vedag":
      return Vedag;
    case "Villas":
      return Villas;
    case "Wierer":
      return Wierer;
    case "Wolfin":
      return Wolfin;
    case "Zanda":
      return Zanda;
    default:
      return null;
  }
};
type Props = {
  brandName?: Logo | null;
  className?: string;
  brandWhiteBox?: boolean;
};
const BrandLogo = ({
  brandName,
  className,
  brandWhiteBox = false,
  ...props
}: Props) => {
  const iconLogo = getLogo(brandName);
  return iconLogo ? (
    <LogoComponent
      className={classnames(className, [brandWhiteBox && classes.whiteBox])}
      source={iconLogo}
      boxed={brandWhiteBox}
      data-testid={"brand-logo"}
      {...props}
    />
  ) : null;
};
export default BrandLogo;
