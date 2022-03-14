import { ThemeProvider } from "@bmi/components";
import type { Product as ESProduct } from "@bmi/elasticsearch-types";
import { createProduct as createESProduct } from "@bmi/elasticsearch-types";
import { render } from "@testing-library/react";
import React from "react";
import ProductsGridView, { Props } from "../ProductsGridView";

const products: ESProduct[] = [createESProduct()];

describe("ProductsGridView component", () => {
  it("renders correctly when empty", () => {
    const products: ESProduct[] = [];
    const pageContext: Props["pageContext"] = {
      countryCode: "no",
      variantCodeToPathMap: {}
    };
    const { container } = render(
      <ThemeProvider>
        <ProductsGridView products={products} pageContext={pageContext} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when not empty", () => {
    const pageContext: Props["pageContext"] = {
      countryCode: "no",
      variantCodeToPathMap: { [products[0].variantCode]: products[0].path }
    };
    const { container } = render(
      <ThemeProvider>
        <ProductsGridView products={products} pageContext={pageContext} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when not empty with filters from url", () => {
    const { location } = window;

    delete window.location;
    window.location = {
      search:
        '?q=query&filters=%5B%7B"name"%3A"brand"%2C"value"%3A%5B"BMI_Components"%5D%7D%5D',
      pathname: "search"
    } as Location;

    const pageContext: Props["pageContext"] = {
      countryCode: "no",
      variantCodeToPathMap: { [products[0].variantCode]: products[0].path }
    };
    const { container } = render(
      <ThemeProvider>
        <ProductsGridView products={products} pageContext={pageContext} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();

    window.location = location;
  });
});
