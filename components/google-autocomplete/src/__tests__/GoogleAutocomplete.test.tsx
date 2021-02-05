import React from "react";
import GoogleAutocomplete from "../";
import { render } from "@testing-library/react";

describe("GoogleAutocomplete component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <GoogleAutocomplete id="google-autocomplete-test" apiKey="" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
