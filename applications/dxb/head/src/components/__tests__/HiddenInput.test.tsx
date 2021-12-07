import React from "react";
import { render } from "@testing-library/react";
import HiddenInput from "../HiddenInput";

describe("HiddenInput component", () => {
  it("renders correctly", () => {
    const { container } = render(<HiddenInput name="Test" value="test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
