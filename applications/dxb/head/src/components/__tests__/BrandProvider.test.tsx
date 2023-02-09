import { useTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import BrandProvider from "../BrandProvider";

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
