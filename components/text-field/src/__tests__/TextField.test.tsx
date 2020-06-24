import React from "react";
import TextField from "../";
import { render } from "@testing-library/react";

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
});
