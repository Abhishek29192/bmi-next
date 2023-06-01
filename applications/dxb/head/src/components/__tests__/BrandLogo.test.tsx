import { ThemeProvider } from "@bmi-digital/components";
import {
  AeroDek,
  Awak,
  BMI,
  BMIAcademy,
  BMIAcademyDE,
  Braas,
  Bramac,
  Canopia,
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
    expect(screen.getByTestId("brand-logo")).toHaveClass("BrandLogo-whiteBox");
  });

  it("should not render with white background by default", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" />
      </ThemeProvider>
    );
    expect(screen.getByTestId("brand-logo")).not.toHaveClass(
      "BrandLogo-whiteBox"
    );
  });
});
