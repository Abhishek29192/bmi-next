import React from "react";
import Hero from "../";
import { render } from "@testing-library/react";

describe("Hero component", () => {
  it("renders correctly", () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
