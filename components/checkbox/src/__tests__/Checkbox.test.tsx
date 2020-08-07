import React from "react";
import Checkbox from "../";
import { render } from "@testing-library/react";

describe("Checkbox component", () => {
  it("renders correctly", () => {
    const { container } = render(<Checkbox />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with label", () => {
    const { container } = render(
      <Checkbox label="Send a copy of this message to my email address" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with error message", () => {
    const { container } = render(
      <Checkbox
        error="You can display an error message here"
        label="Send a copy of this message to my email address"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with disabled state", () => {
    const { container } = render(
      <Checkbox
        disabled
        label="Send a copy of this message to my email address"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
