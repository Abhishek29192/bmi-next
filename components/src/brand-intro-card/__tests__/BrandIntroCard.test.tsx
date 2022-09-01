import { render } from "@testing-library/react";
import React from "react";
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
  it("should render brand without button label & description if not present", () => {
    const { container } = render(<BrandIntroCard logoIcon={brandLogo} />);

    expect(container.querySelectorAll("button").length).toBe(1);
    expect(container.querySelector(".description")).not.toBeInTheDocument();
  });

  it("should render with pointer to default if no action", () => {
    const { container } = render(
      <BrandIntroCard
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
        whiteBox={true}
      />
    );

    expect(container.querySelector(".brandLogoButton")?.classList).toContain(
      "brandLogoButton-no-pointer"
    );
  });
});
