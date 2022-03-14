import React from "react";
import Logo, {
  AeroDek,
  Awak,
  BMI,
  BMI_Academy_DE,
  BMI_Academy_EN,
  BMIAcademy,
  Braas,
  Bramac,
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
  StandardPale,
  Sunscape,
  Vedag,
  Villas,
  Wierer,
  Wolfin,
  Zanda
} from "../";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Logo component", () => {
  it("renders AeroDek correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={AeroDek} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Awak correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Awak} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMI correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={BMI} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMIAcademy correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={BMIAcademy} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMI_Academy_EN correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={BMI_Academy_EN} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders BMI_Academy_DE correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={BMI_Academy_DE} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Braas correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Braas} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Bramac correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Bramac} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Cobert correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Cobert} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Coverland correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Coverland} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Esha correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Esha} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Everguard correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Everguard} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Everlite correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Everlite} />);
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeProduct correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={GuaranteeProduct} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeSolution correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={GuaranteeSolution} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeSystem correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={GuaranteeSystem} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Icopal correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Icopal} />);
    expect(container).toMatchSnapshot();
  });

  it("renders IcopalKatto correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={IcopalKatto} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Monarflex correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Monarflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Monarplan correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Monarplan} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Monier correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Monier} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Necoflex correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Necoflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Ormax correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Ormax} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Redland correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Redland} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofPro correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={RoofPro} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProElite correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={RoofProElite} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProExpert correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={RoofProExpert} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProPartner correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={RoofProPartner} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProPartnerSmall correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={RoofProPartnerSmall} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProServiceTeam correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={RoofProServiceTeam} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Sealoflex correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Sealoflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Siplast correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Siplast} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Standard correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Standard} />);
    expect(container).toMatchSnapshot();
  });

  it("renders StandardCentred correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={StandardCentred} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders StandardPale correctly", () => {
    const { container } = renderWithThemeProvider(
      <Logo source={StandardPale} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Sunscape correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Sunscape} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Vedag correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Vedag} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Villas correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Villas} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Wierer correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Wierer} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Wolfin correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Wolfin} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Zanda correctly", () => {
    const { container } = renderWithThemeProvider(<Logo source={Zanda} />);
    expect(container).toMatchSnapshot();
  });
});
