import React from "react";
import { render } from "@testing-library/react";
import RawTextField from "../";

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
