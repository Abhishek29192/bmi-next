import React from "react";
import { render } from "@testing-library/react";
import MasonryGrid from "../MasonryGrid";

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
    expect(container).toMatchSnapshot();
  });
});
