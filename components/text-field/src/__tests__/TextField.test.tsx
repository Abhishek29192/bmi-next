import React from "react";
import TextField from "../";
import { render } from "@testing-library/react";
import AccountCircle from "@material-ui/icons/AccountCircle";

describe("TextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <TextField label="email" placeholder="e.g. lorem@ipsum.com" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a hybrid variant", () => {
    const { container } = render(
      <TextField
        label="email"
        placeholder="e.g. lorem@ipsum.com"
        variant="hybrid"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with an extra class", () => {
    const { container } = render(
      <TextField
        label="email"
        placeholder="e.g. lorem@ipsum.com"
        className="test"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders as textarea", () => {
    const { container } = render(
      <TextField label="email" placeholder="e.g. lorem@ipsum.com" isTextArea />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with left adornment", () => {
    const { container } = render(
      <TextField
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        leftAdornment={<AccountCircle />}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with right adornment", () => {
    const { container } = render(
      <TextField
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        rightAdornment={<AccountCircle />}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with error", () => {
    const { container } = render(
      <TextField
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        error
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
