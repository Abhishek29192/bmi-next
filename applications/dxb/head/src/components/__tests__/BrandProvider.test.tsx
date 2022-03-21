import React from "react";
import { render, screen } from "@testing-library/react";
import { useTheme } from "@material-ui/core/styles";
import BrandProvider, { getBrandClassName } from "../BrandProvider";
import { ConfigProvider } from "../../contexts/ConfigProvider";

describe("BrandProvider", () => {
  it("renders", () => {
    const { container } = render(
      <ConfigProvider>
        <BrandProvider>Test</BrandProvider>
      </ConfigProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders without BrandProvider", () => {
    const { container } = render(
      <ConfigProvider configObject={{ isBrandProviderEnabled: true }}>
        <BrandProvider>Test</BrandProvider>
      </ConfigProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with brand", () => {
    const { container } = render(
      <ConfigProvider>
        <BrandProvider brand="Braas">Test</BrandProvider>
      </ConfigProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders without brand", () => {
    const { container } = render(<BrandProvider>Without brand</BrandProvider>);
    expect(container).toMatchSnapshot();
  });

  it("adds brand className only when brand is provided", () => {
    const { rerender } = render(
      <ConfigProvider>
        <BrandProvider>Without brand</BrandProvider>
      </ConfigProvider>
    );
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    rerender(
      <ConfigProvider>
        <BrandProvider brand="Unknown">With brand</BrandProvider>
      </ConfigProvider>
    );
    expect(screen.getByTestId("brand-colors-provider")).not.toHaveClass();

    const brand = "Braas";
    const className = getBrandClassName(brand);
    rerender(
      <ConfigProvider>
        <BrandProvider brand={brand}>With brand</BrandProvider>
      </ConfigProvider>
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
      <ConfigProvider>
        <BrandProvider brand="Braas">
          <TestComponent />
        </BrandProvider>
      </ConfigProvider>
    );

    expect(screen.getByText(interColor)).toBeInTheDocument();

    mockGetComputedStyle.mockRestore();
  });
});
