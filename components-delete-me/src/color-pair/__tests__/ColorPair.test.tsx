import React from "react";
import ColorPair, {
  availableThemes,
  ColorPairContext,
  darkThemes,
  withColorPair
} from "../ColorPair";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ColorPair component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ColorPair>Lorem ipsum</ColorPair>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a theme", () => {
    const { container } = renderWithThemeProvider(
      <ColorPair theme="teal500">Lorem ipsum</ColorPair>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a custom element", () => {
    const { container } = renderWithThemeProvider(
      <ColorPair theme="teal500" markupComponent="span">
        Lorem ipsum
      </ColorPair>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a custom component", () => {
    const CustomComponent = withColorPair((props) => (
      <span className="custom-component" {...props} />
    ));
    const { container } = renderWithThemeProvider(
      <CustomComponent theme="teal500">Lorem ipsum</CustomComponent>
    );
    expect(container).toMatchSnapshot();
  });
  it("creates the right context value - light theme", () => {
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
      "blue100",
      "magenta100",
      "aqua100",
      "orange100",
      "alert",
      "black",
      "charcoal",
      "slate",
      "blue800",
      "blue900",
      "teal400",
      "teal500",
      "magenta400",
      "magenta500",
      "purple400",
      "orange500",
      "error",
      "secondary1",
      "secondary2",
      "secondary3",
      "secondary4"
    ]);
  });
  it("exports the correct dark themes", () => {
    expect(darkThemes).toEqual([
      "black",
      "charcoal",
      "slate",
      "blue800",
      "blue900",
      "teal400",
      "teal500",
      "magenta400",
      "magenta500",
      "purple400",
      "orange500",
      "error",
      "secondary1",
      "secondary2",
      "secondary3",
      "secondary4"
    ]);
  });
});
