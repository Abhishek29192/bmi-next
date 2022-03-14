import React from "react";
import mockProduct from "mock-image.jpg";
import mockLogo from "mock-icon.svg";
import ProductDetailsCard from "../ProductDetailsCard";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ProductDetailsCard component", () => {
  it("renders correctly with optional prop", () => {
    const { container } = renderWithThemeProvider(
      <ProductDetailsCard
        media={<img src={mockProduct} alt="Lorem ipsum" />}
        brandLogo={mockLogo}
        title="Sed ut perspiciatis"
        nnob="09174907099"
        action={{ model: "htmlLink", href: "/" }}
        linkLabel="Sit voluptatem"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders deprecated imageSource", () => {
    const { container } = renderWithThemeProvider(
      <ProductDetailsCard
        brandLogo={mockLogo}
        title="Sed ut perspiciatis"
        nnob="09174907099"
        action={{ model: "htmlLink", href: "/" }}
        linkLabel="Sit voluptatem"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without optional prop", () => {
    const { container } = renderWithThemeProvider(
      <ProductDetailsCard
        media={<img src={mockProduct} alt="Lorem ipsum" />}
        brandLogo={mockLogo}
        title="Sed ut perspiciatis"
        nnob="09174907099"
        linkLabel="Sit voluptatem"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
