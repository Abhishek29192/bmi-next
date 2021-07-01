import React from "react";
import { render } from "@testing-library/react";
import { AeroDek as brandLogo } from "@bmi/logo";
import BrandIntroCard from "../";

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