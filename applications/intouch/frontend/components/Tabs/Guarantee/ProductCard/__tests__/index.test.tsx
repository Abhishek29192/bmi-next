import React from "react";
import { renderWithI18NProvider } from "../../../../../lib/tests/utils";
import { generateProduct } from "../../../../../lib/tests/factories/product";
import { ProductCard } from "..";

describe("ProductCard component", () => {
  const product = generateProduct();
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(
      <ProductCard products={[product]} />
    );
    expect(container).toMatchSnapshot();
  });
});
