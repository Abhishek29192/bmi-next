import React from "react";
import BrandIntroCard from "../";
import { render } from "@testing-library/react";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

describe("BrandIntroCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BrandIntroCard
        logoIcon={brandLogo}
        description="desc"
        buttonLabel="label"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
