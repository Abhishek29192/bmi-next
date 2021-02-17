import React from "react";
import { render } from "@testing-library/react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "../";

describe("TextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <TextField
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a hybrid variant", () => {
    const { container } = render(
      <TextField
        id="email"
        name="Email"
        label="Email address"
        variant="hybrid"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with an extra class", () => {
    const { container } = render(
      <TextField
        id="email"
        name="Email"
        label="Email address"
        className="test"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders as textarea", () => {
    const { container } = render(
      <TextField id="email" name="Email" label="Email address" isTextArea />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with left adornment", () => {
    const { container } = render(
      <TextField
        name="Nickname"
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
        name="Nickname"
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
        name="Nickname"
        label="nickname"
        variant="outlined"
        helperText="Icon hint text"
        error
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
