import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { FilterInput } from "..";

describe("FilterInput Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <FilterInput label="Filter Input" />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
