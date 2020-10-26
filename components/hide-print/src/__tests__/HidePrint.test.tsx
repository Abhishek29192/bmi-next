import React from "react";
import HidePrint from "../";
import { render } from "@testing-library/react";

describe("HidePrint component", () => {
  it("renders correctly", () => {
    const { container } = render(<HidePrint>Lorem Ipsum</HidePrint>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with custom component", () => {
    const { container } = render(
      <HidePrint component="span">Lorem Ipsum</HidePrint>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with custom className", () => {
    const { container } = render(
      <HidePrint className="test">Lorem Ipsum</HidePrint>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
