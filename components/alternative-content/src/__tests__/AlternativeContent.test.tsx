import React from "react";
import { render } from "@testing-library/react";
import AlternativeContent from "../";

describe("AlternativeContent component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <AlternativeContent>Lorem Ipsum</AlternativeContent>
    );
    expect(container).toMatchSnapshot();
  });
});
