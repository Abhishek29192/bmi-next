import { screen } from "@testing-library/react";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import Typography from "../Typography";

describe("Typography component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography>Hello World</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders body2 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="body2">Hello World</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders body3 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="body3">Hello World</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h1 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h1">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h1 with underline", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h1" hasUnderline>
        Heading
      </Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h2 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h2">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h3 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h3">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h4 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h4">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h5 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h5">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders h6 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="h6">Heading</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders subtitle1 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="subtitle1">Hello World</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders subtitle2 correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="subtitle2">Hello World</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders button correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="button">Button</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders caption correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="caption">Caption</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders overline correctly", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="overline">Overline</Typography>
    );
    expect(container).toMatchSnapshot();
  });
  it("should add classNames if hasUnderline and hasDarkBackground are true", () => {
    const { rerender } = renderWithThemeProvider(
      <Typography variant="h1">Overline</Typography>
    );
    expect(
      screen?.queryByText("Overline")?.className?.includes("Typography-darkBg-")
    ).toBe(false);
    rerender(
      <Typography variant="h1" hasDarkBackground hasUnderline>
        Overline
      </Typography>
    );

    expect(
      screen?.queryByText("Overline")?.className.includes("Typography-darkBg-")
    ).toBe(true);
  });

  it("should add underline classes if variant prop equals h1 or h2 or h3, h4", () => {
    const { rerender } = renderWithThemeProvider(
      <Typography variant="h1" hasDarkBackground hasUnderline>
        Overline
      </Typography>
    );
    expect(
      screen?.queryByText("Overline")?.className.includes("Typography-darkBg-")
    ).toBe(true);

    rerender(
      <Typography variant="h4" hasDarkBackground hasUnderline>
        Overline
      </Typography>
    );

    expect(
      screen?.queryByText("Overline")?.className.includes("Typography-darkBg-")
    ).toBe(true);

    rerender(
      <Typography variant="h5" hasDarkBackground hasUnderline>
        Overline
      </Typography>
    );

    expect(
      screen?.queryByText("Overline")?.className.includes("Typography-darkBg-")
    ).toBe(false);
  });

  it("should add relevant no clamp class to h1 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h1" noClamp>
        Caption
      </Typography>
    );
    expect(
      getByTestId("typography").className.includes("Typography-h1NoClamp-")
    ).toBe(true);
  });

  it("should add relevant no clamp class to h2 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h2" noClamp>
        Caption
      </Typography>
    );
    expect(
      getByTestId("typography").className.includes("Typography-h2NoClamp-")
    ).toBe(true);
  });

  it("should add relevant no clamp class to h3 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h3" noClamp>
        Caption
      </Typography>
    );
    expect(
      getByTestId("typography").className.includes("Typography-h3NoClamp-")
    ).toBe(true);
  });

  it("should add relevant no clamp class to h4 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h4" noClamp>
        Caption
      </Typography>
    );
    expect(
      getByTestId("typography").className.includes("Typography-h4NoClamp-")
    ).toBe(true);
  });

  it("should not add any no clamp class to h5 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h5" noClamp>
        Caption
      </Typography>
    );
    expect(getByTestId("typography").className.includes("NoClamp-")).toBe(
      false
    );
  });

  it("should add relevant no clamp class to h6 variant when no clamp is specified", () => {
    const { getByTestId } = renderWithThemeProvider(
      <Typography variant="h6" noClamp>
        Caption
      </Typography>
    );
    expect(getByTestId("typography").className.includes("NoClamp-")).toBe(
      false
    );
  });

  it("renders typography variant correctly if variant === default", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="default">Caption</Typography>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders typography variant correctly if variant === lead", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="lead">Caption</Typography>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders typography variant correctly if variant === hero", () => {
    const { container } = renderWithThemeProvider(
      <Typography variant="hero">Caption</Typography>
    );
    expect(container).toMatchSnapshot();
  });
});
