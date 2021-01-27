import React from "react";
import GoogleMap from "../";
import { render } from "@testing-library/react";

describe("GoogleMap component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <GoogleMap apiKey="AIzaSyA-ceJ082hw_1ktpiTdFM_7hFmxMw1R4gU" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
