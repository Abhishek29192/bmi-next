import React from "react";
import ColorPair, { withColorPair } from "../";
import { render } from "@testing-library/react";

describe("ColorPair component", () => {
  it("renders correctly", () => {
    const { container } = render(<ColorPair>Lorem ipsum</ColorPair>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a theme", () => {
    const { container } = render(
      <ColorPair theme="teal-500">Lorem ipsum</ColorPair>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a custom element", () => {
    const { container } = render(
      <ColorPair theme="teal-500" markupComponent="span">
        Lorem ipsum
      </ColorPair>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a custom component", () => {
    const CustomComponent = withColorPair((props) => (
      <span className="custom-component" {...props} />
    ));
    const { container } = render(
      <CustomComponent theme="teal-500">Lorem ipsum</CustomComponent>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
