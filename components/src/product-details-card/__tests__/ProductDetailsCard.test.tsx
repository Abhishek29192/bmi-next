import React from "react";
import { render } from "@testing-library/react";
import mockProduct from "mock-image.jpg";
import mockLogo from "mock-icon.svg";
import ProductDetailsCard from "../ProductDetailsCard";

describe("ProductDetailsCard component", () => {
  it("renders correctly with optional prop", () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
