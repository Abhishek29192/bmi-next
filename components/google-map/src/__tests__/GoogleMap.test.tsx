import React from "react";
import GoogleMap from "../";
import { render } from "@testing-library/react";

describe("GoogleMap component", () => {
  it("renders correctly", () => {
    const { container } = render(<GoogleMap />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
