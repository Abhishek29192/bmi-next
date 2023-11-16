import { ThemeProvider } from "@bmi-digital/components";
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
import Chova from "@bmi-digital/components/logo/Chova";
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
import { render, screen } from "@testing-library/react";
import React from "react";
import BrandLogo, { getLogo } from "../BrandLogo";

describe("getLogo", () => {
  const logos = [
    { name: "AeroDek", expected: AeroDek },
    { name: "Awak", expected: Awak },
    { name: "BMI", expected: BMI },
    { name: "BMIAcademy", expected: BMIAcademy },
    { name: "BMIAcademyEN", expected: BMIAcademy },
    { name: "BMIAcademyDE", expected: BMIAcademyDE },
    { name: "Braas", expected: Braas },
    { name: "Bramac", expected: Bramac },
    { name: "Canopia", expected: Canopia },
    { name: "Cementegola", expected: Cementegola },
    { name: "Chova", expected: Chova },
    { name: "Cobert", expected: Cobert },
    { name: "Coverland", expected: Coverland },
    { name: "Esha", expected: Esha },
    { name: "Everguard", expected: Everguard },
    { name: "Everlite", expected: Everlite },
    { name: "GuaranteeProduct", expected: GuaranteeProduct },
    { name: "GuaranteeSolution", expected: GuaranteeSolution },
    { name: "GuaranteeSystem", expected: GuaranteeSystem },
    { name: "Icopal", expected: Icopal },
    { name: "IcopalKatto", expected: IcopalKatto },
    { name: "IcopalVedag", expected: IcopalVedag },
    { name: "Klober", expected: Klober },
    { name: "Monarflex", expected: Monarflex },
    { name: "Monarplan", expected: Monarplan },
    { name: "Monier", expected: Monier },
    { name: "Necoflex", expected: Necoflex },
    { name: "Ormax", expected: Ormax },
    { name: "Redland", expected: Redland },
    { name: "RoofPro", expected: RoofPro },
    { name: "RoofProElite", expected: RoofProElite },
    { name: "RoofProExpert", expected: RoofProExpert },
    { name: "RoofProPartner", expected: RoofProPartner },
    { name: "RoofProPartnerSmall", expected: RoofProPartnerSmall },
    { name: "RoofProServiceTeam", expected: RoofProServiceTeam },
    { name: "Sealoflex", expected: Sealoflex },
    { name: "SereniCoperture", expected: SereniCoperture },
    { name: "Siplast", expected: Siplast },
    { name: "Standard", expected: Standard },
    { name: "StandardCentred", expected: StandardCentred },
    { name: "Sunscape", expected: Sunscape },
    { name: "Vedag", expected: Vedag },
    { name: "Villas", expected: Villas },
    { name: "Wierer", expected: Wierer },
    { name: "Wolfin", expected: Wolfin },
    { name: "Zanda", expected: Zanda }
  ];

  logos.forEach((logo) => {
    it(`returns the correct logo for ${logo.name}`, () => {
      expect(getLogo(logo.name)).toEqual(logo.expected);
    });
  });

  it("returns undefined if the logo parameter string is not of a valid type", () => {
    expect(getLogo("invalidLogo")).toBeNull();
  });

  it("returns undefined if the logo parameter is an empty string", () => {
    expect(getLogo("")).toBeNull();
  });
});

describe("BrandLogo component", () => {
  it("should render the component correctly if brandName is defined", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" />
      </ThemeProvider>
    );
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
  });

  it("should not render the component if brandName is undefined", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName={null} />
      </ThemeProvider>
    );
    expect(screen.queryByTestId("brand-logo")).not.toBeInTheDocument();
  });

  it("should pass the className prop to the component", () => {
    const className = "test-class";
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" className={className} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("brand-logo")).toHaveClass(className);
  });

  it("should render with white background when brandWhiteBox prop has been passed to the component", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" brandWhiteBox={true} />
      </ThemeProvider>
    );
    const element = screen.getByTestId("brand-logo");
    const style = window.getComputedStyle(element);
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
    expect(style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("should not render with white background by default", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" />
      </ThemeProvider>
    );
    const element = screen.getByTestId("brand-logo");
    const style = window.getComputedStyle(element);
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
    expect(style.backgroundColor).toBe("");
  });
});
