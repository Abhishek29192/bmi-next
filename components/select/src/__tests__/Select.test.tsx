import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MenuItem } from "../";
import Select from "../";

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
    expect(container).toMatchSnapshot();
  });
  it("renders correctly as variant hybrid", () => {
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if label is undefined", () => {
    const { container } = render(
      <Select
        name="Country"
        variant="outlined"
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if labelId is undefined", () => {
    const { container } = render(
      <Select name="Country" variant="outlined" label="label">
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly as variant outlined", () => {
    const { container } = render(
      <Select
        name="Country"
        variant="outlined"
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly as variant undefined", () => {
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
    expect(container).toMatchSnapshot();
  });

  it("displays errorText instead of helperText if error is provided", () => {
    const label = "Country";
    const { container, getByLabelText } = render(
      <Select
        name="Country"
        label={label}
        error={true}
        labelId="outlined-country-simple"
        isRequired
        errorText="errorText"
        fieldIsRequiredError="fieldIsRequiredError"
      >
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );
    fireEvent.blur(getByLabelText(label));

    expect(container).toMatchSnapshot();
  });

  it("displays helperText instead of errorText if errorText provided but error is undefined", () => {
    const { container } = render(
      <Select
        name="Country"
        label="Country"
        labelId="outlined-country-simple"
        helperText="helperText"
        errorText="errorText"
      >
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly if disabled", () => {
    const { container } = render(
      <Select name="Country" disabled>
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with className", () => {
    const { container } = render(
      <Select name="Country" className="class">
        <MenuItem aria-label="None" defaultValue="">
          None
        </MenuItem>
        <MenuItem value="uk">United Kingdom</MenuItem>
        <MenuItem value="no">Norway</MenuItem>
        <MenuItem value="fr">France</MenuItem>
      </Select>
    );

    expect(container).toMatchSnapshot();
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
    expect(onChange).toBeCalledWith("fr");
  });
});
