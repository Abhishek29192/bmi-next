import React from "react";
import { render } from "@testing-library/react";
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
    const { container } = render(
      <ThemeProvider>
        <BrandLogo brandName="Monarplan" brandWhiteBox={true} />
      </ThemeProvider>
    );
    const logo = container.querySelector(".BrandLogo");
    expect(logo!.classList).toContain("BrandLogo-whiteBox");
  });
});
