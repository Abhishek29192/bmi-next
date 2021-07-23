import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { useTheme } from "@material-ui/core";
import BrandProvider, { getBrandClassName } from "../BrandProvider";

describe("BrandProvider", () => {
  it("renders", () => {
    const view = render(<BrandProvider>Test</BrandProvider>);
    expect(view.container.firstChild).toMatchSnapshot();
  });

  it("renders with brand", () => {
    const view = render(<BrandProvider brand="Braas">Test</BrandProvider>);
    expect(view.container.firstChild).toMatchSnapshot();
  });

  it("adds brand className only when correct brand is provided", () => {
    const { rerender } = render(<BrandProvider>Without brand</BrandProvider>);
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    rerender(<BrandProvider brand="Unknown">With brand</BrandProvider>);
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    const brand = "Braas";
    const className = getBrandClassName(brand);
    rerender(<BrandProvider brand={brand}>With brand</BrandProvider>);
    expect(screen.getByTestId("brand-colors-provider")).toHaveClass(className);
  });

  it("modifies Material UI Theme with interaction color", () => {
    const interColor = "#d10513";

    const mockGetComputedStyle = jest.spyOn(global, "getComputedStyle");
    mockGetComputedStyle.mockReturnValueOnce({
      getPropertyValue: () => interColor
    } as any);

    const TestComponent = () => {
      const theme = useTheme();
      return <div>{theme.palette.primary.main}</div>;
    };

    render(
      <BrandProvider brand="Braas">
        <TestComponent />
      </BrandProvider>
    );

    expect(screen.getByText(interColor)).toBeInTheDocument();

    mockGetComputedStyle.mockRestore();
  });
});
