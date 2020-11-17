import React from "react";
import Select, { MenuItem } from "../";
import { render, fireEvent } from "@testing-library/react";

describe("Select component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Select name="Country" label="Country" labelId="outlined-country-simple">
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly as hybrid variant", () => {
    const { container } = render(
      <Select
        name="Country"
        variant="hybrid"
        label="Country"
        labelId="outlined-country-simple"
      >
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange handler", () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = render(
      <Select
        name="Country"
        variant="hybrid"
        label="Country"
        labelId="outlined-country-simple"
        onChange={onChange}
        defaultValue="uk"
      >
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );
    fireEvent.change(getByDisplayValue("uk"), { target: { value: "fr" } });
    expect(onChange.mock.calls).toMatchSnapshot();
  });
});
