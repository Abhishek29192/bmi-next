import React from "react";
import Chip from "../Chip";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Chip component", () => {
  it("renders correctly default chip", () => {
    const { container } = renderWithThemeProvider(<Chip>test content</Chip>);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly selected chip", () => {
    const { container } = renderWithThemeProvider(
      <Chip type="selectable" isSelected={true}>
        selected chip
      </Chip>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly removable chip", () => {
    const { container } = renderWithThemeProvider(
      <Chip type="removable" onClick={() => {}}>
        removable chip
      </Chip>
    );
    expect(container).toMatchSnapshot();
  });
});
