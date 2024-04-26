import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createProduct as createESProduct } from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  GoodBetterBest,
  createProduct as createPimProduct
} from "@bmi/pim-types";
import type { Product as ESProduct } from "@bmi/elasticsearch-types";
import ProductsGridView, { Props } from "../ProductsGridView";

const products: ESProduct[] = [createESProduct()];

const pageContext: Props["pageContext"] = {
  countryCode: "no",
  variantCodeToPathMap: { [products[0].variantCode]: products[0].path }
};

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
    const { container } = render(
      <ThemeProvider>
        <ProductsGridView products={products} pageContext={pageContext} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when not empty with filters from url", () => {
    const { location } = window;

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search:
          '?q=query&filters=%5B%7B"name"%3A"brand"%2C"value"%3A%5B"BMI_Components"%5D%7D%5D',
        pathname: "search"
      }
    });

    const { container } = render(
      <ThemeProvider>
        <ProductsGridView products={products} pageContext={pageContext} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();

    window.location = location;
  });

  it("renders the base product name when defined, by default", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[
            createESProduct({
              baseProduct: createPimProduct({ name: "baseProductName" })
            })
          ]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );
    const title = screen.getByTestId("tappable-card-body-title");
    expect(title).toHaveTextContent(/^baseProductName$/);
  });

  it("renders the variant product name if the base product name is undefined", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[
            createESProduct({
              baseProduct: createPimProduct({ name: undefined })
            })
          ]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );
    const title = screen.getByTestId("tappable-card-body-title");
    expect(title).toHaveTextContent(/^name$/);
  });

  it("should render the tag component if goodBetterBest is defined", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[createESProduct({ goodBetterBest: GoodBetterBest.best })]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("tag-indicator-best")).toBeInTheDocument();
    expect(screen.getByTestId("tag-icon-best")).toBeInTheDocument();
    expect(
      screen.getByText("MC: goodBetterBest.label.best")
    ).toBeInTheDocument();
  });

  it("should not render the tag component if goodBetterBest is undefined", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[createESProduct({ goodBetterBest: undefined })]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("tag-indicator-best")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("tag-indicator-better")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tag-indicator-good")).not.toBeInTheDocument();
  });

  it("renders the variant main image with an alt text using the uniqueClassifications string and base product name, when defined ", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[
            createESProduct({
              subTitle: "example-sub-title",
              baseProduct: createPimProduct({ name: "baseProductName" })
            })
          ]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );
    const image = screen.getByTestId("tappable-card-media");
    expect(image).toHaveAttribute("src", "http://localhost:8000");
    expect(image).toHaveAttribute("alt", "example-sub-title baseProductName");
  });

  it("uses the variant product name when the base product name is undefined for the image alternative text", () => {
    render(
      <ThemeProvider>
        <ProductsGridView
          products={[
            createESProduct({
              subTitle: "example-sub-title",
              baseProduct: createPimProduct({ name: undefined })
            })
          ]}
          pageContext={pageContext}
        />
      </ThemeProvider>
    );
    const image = screen.getByTestId("tappable-card-media");
    expect(image).toHaveAttribute("alt", "example-sub-title name");
  });
});
