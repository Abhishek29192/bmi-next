import React from "react";
import { render } from "@testing-library/react";
import { AeroDek as brandLogo } from "../../logo";
import BrandIntroCard from "../BrandIntroCard";

describe("BrandIntroCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BrandIntroCard
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("should render brand logo without whiteBox", () => {
    const { container } = render(
      <BrandIntroCard
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
      />
    );
    const svgLogo = container.querySelector(".brandLogo");

    expect(svgLogo?.classList).not.toContain("brandLogo-whiteBox");
  });
  it("should render brand logo with whiteBox", () => {
    const { container } = render(
      <BrandIntroCard
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
        whiteBox={true}
      />
    );
    const svgLogo = container.querySelector(".brandLogo");

    expect(svgLogo?.classList).toContain("brandLogo-whiteBox");
  });
});
