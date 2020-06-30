import React from "react";
import Button from "../";
import { render } from "@testing-library/react";

describe("Button component", () => {
  it("renders correctly", () => {
    const { container } = render(<Button>Caption</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders an outlined button on dark background", () => {
    const { container } = render(
      <Button hasDarkBackground variant="outlined">
        Caption
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a flat button on dark background", () => {
    const { container } = render(
      <Button hasDarkBackground variant="text">
        Caption
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
