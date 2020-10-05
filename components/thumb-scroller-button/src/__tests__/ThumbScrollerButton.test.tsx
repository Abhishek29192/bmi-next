import React from "react";
import ThumbScrollerButton from "../";
import { render } from "@testing-library/react";

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
});
