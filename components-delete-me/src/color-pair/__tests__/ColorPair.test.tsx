import React from "react";
import { render } from "@testing-library/react";
import ColorPair, {
  availableThemes,
  withColorPair,
  ColorPairContext,
  darkThemes
} from "../ColorPair";

describe("ColorPair component", () => {
  it("renders correctly", () => {
    const { container } = render(<ColorPair>Lorem ipsum</ColorPair>);
    expect(container).toMatchSnapshot();
  });
  it("renders with a theme", () => {
    const { container } = render(
      <ColorPair theme="teal-500">Lorem ipsum</ColorPair>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a custom element", () => {
    const { container } = render(
      <ColorPair theme="teal-500" markupComponent="span">
        Lorem ipsum
      </ColorPair>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a custom component", () => {
    const CustomComponent = withColorPair((props) => (
      <span className="custom-component" {...props} />
    ));
    const { container } = render(
      <CustomComponent theme="teal-500">Lorem ipsum</CustomComponent>
    );
    expect(container).toMatchSnapshot();
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

    expect(container).toMatchSnapshot();
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

    expect(container).toMatchSnapshot();
  });
  it("exports the correct available themes", () => {
    expect(availableThemes).toEqual([
      "white",
      "alabaster",
      "pearl",
      "storm",
      "blue-100",
      "magenta-100",
      "aqua-100",
      "orange-100",
      "alert",
      "black",
      "charcoal",
      "slate",
      "blue-800",
      "blue-900",
      "teal-400",
      "teal-500",
      "magenta-400",
      "magenta-500",
      "purple-400",
      "orange-500",
      "error",
      "color-theme-secondary-1",
      "color-theme-secondary-2",
      "color-theme-secondary-3",
      "color-theme-secondary-4"
    ]);
  });
  it("exports the correct dark themes", () => {
    expect(darkThemes).toEqual([
      "black",
      "charcoal",
      "slate",
      "blue-800",
      "blue-900",
      "teal-400",
      "teal-500",
      "magenta-400",
      "magenta-500",
      "purple-400",
      "orange-500",
      "error",
      "color-theme-secondary-1",
      "color-theme-secondary-2",
      "color-theme-secondary-3",
      "color-theme-secondary-4"
    ]);
  });
});
