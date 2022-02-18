import { render } from "@testing-library/react";
import React from "react";
import Logo, {
  AeroDek,
  Awak,
  BMI,
  BMIAcademy,
  BMI_Academy_EN,
  BMI_Academy_DE,
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

describe("Logo component", () => {
  it("renders AeroDek correctly", () => {
    const { container } = render(<Logo source={AeroDek} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Awak correctly", () => {
    const { container } = render(<Logo source={Awak} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMI correctly", () => {
    const { container } = render(<Logo source={BMI} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMIAcademy correctly", () => {
    const { container } = render(<Logo source={BMIAcademy} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMI_Academy_EN correctly", () => {
    const { container } = render(<Logo source={BMI_Academy_EN} />);
    expect(container).toMatchSnapshot();
  });

  it("renders BMI_Academy_DE correctly", () => {
    const { container } = render(<Logo source={BMI_Academy_DE} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Braas correctly", () => {
    const { container } = render(<Logo source={Braas} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Bramac correctly", () => {
    const { container } = render(<Logo source={Bramac} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Cobert correctly", () => {
    const { container } = render(<Logo source={Cobert} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Coverland correctly", () => {
    const { container } = render(<Logo source={Coverland} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Esha correctly", () => {
    const { container } = render(<Logo source={Esha} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Everguard correctly", () => {
    const { container } = render(<Logo source={Everguard} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Everlite correctly", () => {
    const { container } = render(<Logo source={Everlite} />);
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeProduct correctly", () => {
    const { container } = render(<Logo source={GuaranteeProduct} />);
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeSolution correctly", () => {
    const { container } = render(<Logo source={GuaranteeSolution} />);
    expect(container).toMatchSnapshot();
  });

  it("renders GuaranteeSystem correctly", () => {
    const { container } = render(<Logo source={GuaranteeSystem} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Icopal correctly", () => {
    const { container } = render(<Logo source={Icopal} />);
    expect(container).toMatchSnapshot();
  });

  it("renders IcopalKatto correctly", () => {
    const { container } = render(<Logo source={IcopalKatto} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Monarflex correctly", () => {
    const { container } = render(<Logo source={Monarflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Monarplan correctly", () => {
    const { container } = render(<Logo source={Monarplan} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Monier correctly", () => {
    const { container } = render(<Logo source={Monier} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Necoflex correctly", () => {
    const { container } = render(<Logo source={Necoflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Ormax correctly", () => {
    const { container } = render(<Logo source={Ormax} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Redland correctly", () => {
    const { container } = render(<Logo source={Redland} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofPro correctly", () => {
    const { container } = render(<Logo source={RoofPro} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProElite correctly", () => {
    const { container } = render(<Logo source={RoofProElite} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProExpert correctly", () => {
    const { container } = render(<Logo source={RoofProExpert} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProPartner correctly", () => {
    const { container } = render(<Logo source={RoofProPartner} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProPartnerSmall correctly", () => {
    const { container } = render(<Logo source={RoofProPartnerSmall} />);
    expect(container).toMatchSnapshot();
  });

  it("renders RoofProServiceTeam correctly", () => {
    const { container } = render(<Logo source={RoofProServiceTeam} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Sealoflex correctly", () => {
    const { container } = render(<Logo source={Sealoflex} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Siplast correctly", () => {
    const { container } = render(<Logo source={Siplast} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Standard correctly", () => {
    const { container } = render(<Logo source={Standard} />);
    expect(container).toMatchSnapshot();
  });

  it("renders StandardCentred correctly", () => {
    const { container } = render(<Logo source={StandardCentred} />);
    expect(container).toMatchSnapshot();
  });

  it("renders StandardPale correctly", () => {
    const { container } = render(<Logo source={StandardPale} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Sunscape correctly", () => {
    const { container } = render(<Logo source={Sunscape} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Vedag correctly", () => {
    const { container } = render(<Logo source={Vedag} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Villas correctly", () => {
    const { container } = render(<Logo source={Villas} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Wierer correctly", () => {
    const { container } = render(<Logo source={Wierer} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Wolfin correctly", () => {
    const { container } = render(<Logo source={Wolfin} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Zanda correctly", () => {
    const { container } = render(<Logo source={Zanda} />);
    expect(container).toMatchSnapshot();
  });
});
