import React from "react";
import Select from "../";
import { render } from "@testing-library/react";

describe("Select component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Select label="Country" labelId="outlined-country-simple">
        <Select.Item aria-label="None" value="">
          None
        </Select.Item>
        <Select.Item value="uk">United Kingdom</Select.Item>
        <Select.Item value="no">Norway</Select.Item>
        <Select.Item value="fr">France</Select.Item>
      </Select>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly as hybrid variant", () => {
    const { container } = render(
      <Select
        variant="hybrid"
        label="Country"
        labelId="outlined-country-simple"
      >
        <Select.Item aria-label="None" value="">
          None
        </Select.Item>
        <Select.Item value="uk">United Kingdom</Select.Item>
        <Select.Item value="no">Norway</Select.Item>
        <Select.Item value="fr">France</Select.Item>
      </Select>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
