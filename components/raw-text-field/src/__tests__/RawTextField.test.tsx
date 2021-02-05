import React from "react";
import RawTextField from "../";
import { render } from "@testing-library/react";

describe("RawTextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
