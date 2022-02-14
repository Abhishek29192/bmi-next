import React from "react";
import { render } from "@testing-library/react";
import Chip from "../";

describe("Chip component", () => {
  it("renders correctly default chip", () => {
    const { container } = render(<Chip>test content</Chip>);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly selected chip", () => {
    const { container } = render(
      <Chip type="selectable" isSelected={true}>
        selected chip
      </Chip>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly removable chip", () => {
    const { container } = render(
      <Chip type="removable" onClick={() => {}}>
        removable chip
      </Chip>
    );
    expect(container).toMatchSnapshot();
  });
});
