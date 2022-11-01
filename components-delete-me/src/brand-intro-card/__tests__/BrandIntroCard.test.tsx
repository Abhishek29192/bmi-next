import { queryByTestId } from "@testing-library/react";
import React from "react";
import { AeroDek as brandLogo } from "../../logo";
import { renderWithThemeProvider } from "../../__tests__/helper";
import BrandIntroCard from "../BrandIntroCard";

describe("BrandIntroCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <BrandIntroCard
        name={"AeroDek"}
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render brand logo without whiteBox", () => {
    const { container } = renderWithThemeProvider(
      <BrandIntroCard
        name={"AeroDek"}
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
      />
    );
    const svgLogo = queryByTestId(container, "brandLogo");

    expect(svgLogo!.classList.toString()).not.toContain(
      "BrandIntroCard-whiteBox"
    );
  });

  it("should render brand logo with whiteBox", () => {
    const { container } = renderWithThemeProvider(
      <BrandIntroCard
        name={"AeroDek"}
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
        whiteBox={true}
      />
    );
    const svgLogo = queryByTestId(container, "brandLogo");

    expect(svgLogo!.classList.toString()).toContain("BrandIntroCard-whiteBox");
  });
  it("should render brand without button label & description if not present", () => {
    const { container, queryByTestId } = renderWithThemeProvider(
      <BrandIntroCard name={"AeroDek"} logoIcon={brandLogo} />
    );

    expect(container.querySelectorAll("button").length).toBe(1);
    expect(queryByTestId("brandLogoDescription")).toBe(null);
  });

  it("should render with pointer to default if no action", () => {
    const { getByTestId } = renderWithThemeProvider(
      <BrandIntroCard
        name={"AeroDek"}
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
        whiteBox={true}
      />
    );

    expect(
      getByTestId("brandLogoButton")?.className.includes(
        "BrandIntroCard-noPointer"
      )
    ).toBe(true);
  });
});
