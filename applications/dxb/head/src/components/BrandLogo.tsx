import Logo from "@bmi-digital/components/logo";
import AeroDek from "@bmi-digital/components/logo/AeroDek";
import Awak from "@bmi-digital/components/logo/Awak";
import BMI from "@bmi-digital/components/logo/Bmi";
import BMIAcademy from "@bmi-digital/components/logo/BmiAcademy";
import BMIAcademyDE from "@bmi-digital/components/logo/BmiAcademyDe";
import Braas from "@bmi-digital/components/logo/Braas";
import Bramac from "@bmi-digital/components/logo/Bramac";
import Canopia from "@bmi-digital/components/logo/Canopia";
import Cementegola from "@bmi-digital/components/logo/Cementegola";
import Cobert from "@bmi-digital/components/logo/Cobert";
import Coverland from "@bmi-digital/components/logo/Coverland";
import Esha from "@bmi-digital/components/logo/Esha";
import Everguard from "@bmi-digital/components/logo/Everguard";
import Everlite from "@bmi-digital/components/logo/Everlite";
import GuaranteeProduct from "@bmi-digital/components/logo/GuaranteeProduct";
import GuaranteeSolution from "@bmi-digital/components/logo/GuaranteeSolution";
import GuaranteeSystem from "@bmi-digital/components/logo/GuaranteeSystem";
import Icopal from "@bmi-digital/components/logo/Icopal";
import IcopalKatto from "@bmi-digital/components/logo/IcopalKatto";
import IcopalVedag from "@bmi-digital/components/logo/IcopalVedag";
import Klober from "@bmi-digital/components/logo/Klober";
import Monarflex from "@bmi-digital/components/logo/Monarflex";
import Monarplan from "@bmi-digital/components/logo/Monarplan";
import Monier from "@bmi-digital/components/logo/Monier";
import Necoflex from "@bmi-digital/components/logo/Necoflex";
import Ormax from "@bmi-digital/components/logo/Ormax";
import Redland from "@bmi-digital/components/logo/Redland";
import RoofPro from "@bmi-digital/components/logo/RoofPro";
import RoofProElite from "@bmi-digital/components/logo/RoofProElite";
import RoofProExpert from "@bmi-digital/components/logo/RoofProExpert";
import RoofProPartner from "@bmi-digital/components/logo/RoofProPartner";
import RoofProPartnerSmall from "@bmi-digital/components/logo/RoofProPartnerSmall";
import RoofProServiceTeam from "@bmi-digital/components/logo/RoofProServiceTeam";
import Sealoflex from "@bmi-digital/components/logo/Sealoflex";
import SereniCoperture from "@bmi-digital/components/logo/SereniCoperture";
import Siplast from "@bmi-digital/components/logo/Siplast";
import Standard from "@bmi-digital/components/logo/Standard";
import StandardCentred from "@bmi-digital/components/logo/StandardCentred";
import Sunscape from "@bmi-digital/components/logo/Sunscape";
import Vedag from "@bmi-digital/components/logo/Vedag";
import Villas from "@bmi-digital/components/logo/Villas";
import Wierer from "@bmi-digital/components/logo/Wierer";
import Wolfin from "@bmi-digital/components/logo/Wolfin";
import Zanda from "@bmi-digital/components/logo/Zanda";
import classnames from "classnames";
import React from "react";
import { classes, LogoComponent } from "./styles/BrandLogoStyles";

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
