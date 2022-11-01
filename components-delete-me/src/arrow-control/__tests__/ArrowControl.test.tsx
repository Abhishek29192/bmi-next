import React from "react";
import { fireEvent } from "@testing-library/react";
import ArrowControl from "../ArrowControl";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ArrowControl component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ArrowControl direction="left" />
    );
    expect(container).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const { getByLabelText } = renderWithThemeProvider(
      <ArrowControl direction="left" onClick={onClick} />
    );

    // TODO: Change this when the string becomes dynamic.
    fireEvent.click(getByLabelText("Move left"));
    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
