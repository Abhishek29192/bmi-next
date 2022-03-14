import React from "react";
import { ColorPairContext } from "../../color-pair";
import AnchorLink from "../AnchorLink";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("AnchorLink component", () => {
  it("renders default correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }}>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders disabled correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} isDisabled>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders leading icon correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconStart>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders trailing internal icon correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders trailing external icon correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} isExternal iconEnd>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders icon disabled correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd isDisabled>
        BMI Group
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders multi-line with icon correctly", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
        <p style={{ width: "300px", textAlign: "left" }}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with a specified color", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink color="white">BMI Group</AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders within a dark color pair context", () => {
    const { container } = renderWithThemeProvider(
      <ColorPairContext.Provider value={{ type: "dark" }}>
        <AnchorLink color="white">BMI Group</AnchorLink>
      </ColorPairContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders within a light color pair context", () => {
    const { container } = renderWithThemeProvider(
      <ColorPairContext.Provider value={{ type: "light" }}>
        <AnchorLink color="white">BMI Group</AnchorLink>
      </ColorPairContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders only with data from context", () => {
    const { container } = renderWithThemeProvider(
      <ColorPairContext.Provider value={{ type: "light" }}>
        <AnchorLink>BMI Group</AnchorLink>
      </ColorPairContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with rest props", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink target="_blank" rel="noreferrer">
        Test
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with children component", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink>
        <div>Test</div>
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with className", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink className="test-className">Test</AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with iconInverted", () => {
    const { container } = renderWithThemeProvider(
      <AnchorLink iconInverted iconStart>
        Test
      </AnchorLink>
    );
    expect(container).toMatchSnapshot();
  });
});
