import React from "react";
import { render } from "@testing-library/react";
import Autocomplete from "../Autocomplete";

describe("Autocomplete component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
      <Autocomplete.Option text="text" secondaryText="secondaryText" />
    );
    expect(container).toMatchSnapshot();
  });
});