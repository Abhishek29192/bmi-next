import React from "react";
import Autocomplete from "../Autocomplete";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Autocomplete component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Autocomplete
        id="autocomplete-test"
        options={[
          "Icopal",
          "Monier",
          "Monarplan",
          "Monarflex",
          "Arrow",
          "Zanda",
          "AeroDek"
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with start icon", () => {
    const { container } = renderWithThemeProvider(
      <Autocomplete
        id="autocomplete-test"
        options={[
          "Icopal",
          "Monier",
          "Monarplan",
          "Monarflex",
          "Arrow",
          "Zanda",
          "AeroDek"
        ]}
        startAdornmentIcon="HardHatHead"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with all data option component", () => {
    const { container } = renderWithThemeProvider(
      <Autocomplete.Option
        text="text"
        secondaryText="secondaryText"
        matches={[
          { length: 1, offset: 1 },
          { length: 2, offset: 2 }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with partial data option component", () => {
    const { container } = renderWithThemeProvider(
      <Autocomplete.Option text="text" secondaryText="secondaryText" />
    );
    expect(container).toMatchSnapshot();
  });
});
