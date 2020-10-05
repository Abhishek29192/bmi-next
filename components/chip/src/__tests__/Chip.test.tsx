import React from "react";
import Chip from "../";
import { render } from "@testing-library/react";

describe("Chip component", () => {
  it("renders correctly default chip", () => {
    const { container } = render(<Chip>test content</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly selected chip", () => {
    const { container } = render(
      <Chip type="selectable" isSelected={true}>
        selected chip
      </Chip>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
