import React from "react";
import MasonryGrid from "../";
import { render } from "@testing-library/react";

describe("MasonryGrid component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MasonryGrid>
        <div>ONE</div>
        <div>TWO</div>
        <div>THREE</div>
        <div>FOUR</div>
      </MasonryGrid>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
