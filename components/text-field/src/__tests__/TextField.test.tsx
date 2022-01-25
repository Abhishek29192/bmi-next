import React from "react";
import { fireEvent, render } from "@testing-library/react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ControlledTextField from "../";
import { TextField } from "../";

describe("ControlledTextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ControlledTextField
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a hybrid variant", () => {
    const { container } = render(
      <ControlledTextField
        id="email"
        name="Email"
        label="Email address"
        variant="hybrid"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with an extra class", () => {
    const { container } = render(
      <ControlledTextField
        id="email"
        name="Email"
        label="Email address"
        className="test"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders as textarea", () => {
    const { container } = render(
      <ControlledTextField
        id="email"
        name="Email"
        label="Email address"
        isTextArea
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with left adornment", () => {
    const { container } = render(
      <ControlledTextField
        name="Nickname"
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        leftAdornment={<AccountCircle />}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with right adornment", () => {
    const { container } = render(
      <ControlledTextField
        name="Nickname"
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        rightAdornment={<AccountCircle />}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with onChange", () => {
    const onChange = jest.fn();
    const { container } = render(
      <ControlledTextField
        name="Nickname"
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        onChange={onChange}
      />
    );
    const input = container.querySelectorAll("input")[0];

    fireEvent.change(input, {
      target: { value: "test value" }
    });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });
});

describe("TextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ControlledTextField
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with error", () => {
    const { container } = render(
      <TextField
        name="Nickname"
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        error
        errorText="error text"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
