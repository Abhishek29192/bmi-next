import React from "react";
import ThumbScrollerButton from "../ThumbScrollerButton";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ThumbScrollerButton component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ThumbScrollerButton
        direction="right"
        onClick={() => console.log("Right clicked!")}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when direction is left", () => {
    const { container } = renderWithThemeProvider(
      <ThumbScrollerButton
        direction="left"
        onClick={() => console.log("Left clicked!")}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when className is provided", () => {
    const { container } = renderWithThemeProvider(
      <ThumbScrollerButton
        className="testClass"
        direction="left"
        onClick={() => console.log("Left clicked!")}
      />
    );
    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll(".testClass").length).toBe(1);
  });
});
