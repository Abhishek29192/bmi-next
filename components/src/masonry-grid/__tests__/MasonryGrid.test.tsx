import React from "react";
import MasonryGrid from "../MasonryGrid";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("MasonryGrid component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
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
