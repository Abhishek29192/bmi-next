import React from "react";
import { render } from "@testing-library/react";
import ColorPair, {
  availableThemes,
  withColorPair,
  ColorPairContext
} from "../";

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
  it("creates the right context value - light theme", () => {
    const { container } = render(
      <ColorPair theme="white">
        <ColorPairContext.Consumer>
          {({ type, theme }) => (
            <span>
              type: {type}, theme: {theme}
            </span>
          )}
        </ColorPairContext.Consumer>
      </ColorPair>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("creates the right context value - dark theme", () => {
    const { container } = render(
      <ColorPair theme="black">
        <ColorPairContext.Consumer>
          {({ type, theme }) => (
            <span>
              type: {type}, theme: {theme}
            </span>
          )}
        </ColorPairContext.Consumer>
      </ColorPair>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("exports the correct available themes", () => {
    expect(availableThemes).toMatchSnapshot();
  });
});
