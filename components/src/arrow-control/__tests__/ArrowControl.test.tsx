import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ArrowControl from "../ArrowControl";

describe("ArrowControl component", () => {
  it("renders correctly", () => {
    const { container } = render(<ArrowControl direction="left" />);
    expect(container).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const { getByLabelText } = render(
      <ArrowControl direction="left" onClick={onClick} />
    );

    // TODO: Change this when the string becomes dynamic.
    fireEvent.click(getByLabelText("Move left"));
    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
