import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { useTheme } from "@material-ui/core/styles";
import BrandProvider, { getBrandClassName } from "../BrandProvider";
import { ConfigProviderMock } from "./utils/ConfigProviderMock";

describe("BrandProvider", () => {
  it("renders", () => {
    const { container } = render(
      <ConfigProviderMock>
        <BrandProvider>Test</BrandProvider>
      </ConfigProviderMock>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders without BrandProvider", () => {
    const { container } = render(
      <ConfigProviderMock customConfig={{ brandProviderToggler: false }}>
        <BrandProvider>Test</BrandProvider>
      </ConfigProviderMock>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with brand", () => {
    const { container } = render(
      <ConfigProviderMock>
        <BrandProvider brand="Braas">Test</BrandProvider>
      </ConfigProviderMock>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders without brand", () => {
    const { container } = render(<BrandProvider>Without brand</BrandProvider>);
    expect(container).toMatchSnapshot();
  });

  it("adds brand className only when brand is provided", () => {
    const { rerender } = render(
      <ConfigProviderMock>
        <BrandProvider>Without brand</BrandProvider>
      </ConfigProviderMock>
    );
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    rerender(
      <ConfigProviderMock>
        <BrandProvider brand="Unknown">With brand</BrandProvider>
      </ConfigProviderMock>
    );
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    const brand = "Braas";
    const className = getBrandClassName(brand);
    rerender(
      <ConfigProviderMock>
        <BrandProvider brand={brand}>With brand</BrandProvider>
      </ConfigProviderMock>
    );
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
      <ConfigProviderMock>
        <BrandProvider brand="Braas">
          <TestComponent />
        </BrandProvider>
      </ConfigProviderMock>
    );

    expect(screen.getByText(interColor)).toBeInTheDocument();

    mockGetComputedStyle.mockRestore();
  });
});
