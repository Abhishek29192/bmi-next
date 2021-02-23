import React from "react";
import { render } from "@testing-library/react";
import Autocomplete from "../";

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
    expect(container.firstChild).toMatchSnapshot();
  });
});
