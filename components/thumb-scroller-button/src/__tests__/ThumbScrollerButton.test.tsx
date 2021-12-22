import React from "react";
import { render } from "@testing-library/react";
import ThumbScrollerButton from "../";

describe("ThumbScrollerButton component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThumbScrollerButton
        direction="right"
        onClick={() => console.log("Right clicked!")}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when direction is left", () => {
    const { container } = render(
      <ThumbScrollerButton
        direction="left"
        onClick={() => console.log("Left clicked!")}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when className is provided", () => {
    const { container } = render(
      <ThumbScrollerButton
        className="testClass"
        direction="left"
        onClick={() => console.log("Left clicked!")}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelectorAll(".testClass").length).toBe(1);
  });
});
