import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import BrandLogo from "../BrandLogo";

describe("BrandLogo component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("will not render with invalid logo name", () => {
    const { container } = render(
      <ThemeProvider>
        <BrandLogo brandName="does_not_exist" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("will not render with missing logo name", () => {
    const { container } = render(
      <ThemeProvider>
        <BrandLogo brandName="" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with white background", () => {
    render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" brandWhiteBox={true} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("brand-logo")).toHaveClass("BrandLogo-whiteBox");
  });
});
