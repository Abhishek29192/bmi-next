import React from "react";
import { ProductCard } from "..";
import { generateProduct } from "../../../../../lib/tests/factories/product";
import { renderWithI18NProvider } from "../../../../../lib/tests/utils";

describe("ProductCard component", () => {
  const product = generateProduct();
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(
      <ProductCard products={[product]} />
    );
    expect(container).toMatchSnapshot();
  });
});
