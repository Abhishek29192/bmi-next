import React from "react";
import { render } from "@testing-library/react";
import mockProduct from "mock-image.jpg";
import mockLogo from "mock-icon.svg";
import ProductDetailsCard from "../";

describe("ProductDetailsCard component", () => {
  it("renders correctly with optional prop", () => {
    const { container } = render(
      <ProductDetailsCard
        imageSource={mockProduct}
        brandLogo={mockLogo}
        title="Sed ut perspiciatis"
        nnob="09174907099"
        action={{ model: "htmlLink", href: "/" }}
        linkLabel="Sit voluptatem"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without optional prop", () => {
    const { container } = render(
      <ProductDetailsCard
        imageSource={mockProduct}
        brandLogo={mockLogo}
        title="Sed ut perspiciatis"
        nnob="09174907099"
        linkLabel="Sit voluptatem"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
