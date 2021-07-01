import React from "react";
import { render } from "@testing-library/react";
import BrandLogo from "../BrandLogo";

describe("BrandLogo component", () => {
  it("renders correctly", () => {
    const { container } = render(<BrandLogo brandName="Monarplan" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("will not render with invalid logo name", () => {
    const { container } = render(<BrandLogo brandName="does_not_exist" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("will not render with missing logo name", () => {
    const { container } = render(<BrandLogo brandName="" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});