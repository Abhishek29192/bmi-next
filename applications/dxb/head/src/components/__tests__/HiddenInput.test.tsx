import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import HiddenInput from "../HiddenInput";

describe("HiddenInput component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <HiddenInput name="Test" value="test" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
