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
});
