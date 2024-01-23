import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import { GoodBetterBest } from "@bmi/pim-types";
import createRelatedProduct from "../../__tests__/helpers/RelatedProductHelper";
import { RelatedProduct } from "../../types/pim";
import RelatedProducts from "../RelatedProducts";

describe("RelatedProducts component", () => {
  it("renders correctly with no related products", () => {
    const { container } = render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={[]} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with related products", () => {
    const relatedProducts: RelatedProduct[] = [createRelatedProduct()];

    const { container } = render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with related products without groups", () => {
    const relatedProducts: RelatedProduct[] = [
      createRelatedProduct({ groups: [] })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without Brand and External Product code on related products", () => {
    const relatedProducts: RelatedProduct[] = [
      createRelatedProduct({ brand: null }),
      createRelatedProduct({ externalProductCode: null }),
      createRelatedProduct({ brand: null, externalProductCode: null })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with correct gtmLabel", () => {
    const relatedProducts: RelatedProduct[] = [createRelatedProduct()];

    const { container } = render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    const expectedDataGtm = JSON.stringify({
      id: "cta-click1",
      label:
        "name - Shadow Black, Gloss, 6x7x8symbol - MC: pdp.relatedProducts.viewDetails",
      action: "/en/path/"
    });

    expect(
      screen.getByTestId("tappable-card-main").getAttribute("data-gtm")
    ).toEqual(expectedDataGtm);
  });

  it("should render the tag component if goodBetterBest is defined", () => {
    const relatedProducts: RelatedProduct[] = [
      createRelatedProduct({ goodBetterBest: GoodBetterBest.best })
    ];

    render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("tag-indicator-best")).toBeInTheDocument();
    expect(screen.getByTestId("tag-icon-best")).toBeInTheDocument();
    expect(
      screen.getByText("MC: goodBetterBest.label.best")
    ).toBeInTheDocument();
  });

  it("should not render the tag component if goodBetterBest is undefined", () => {
    const relatedProducts: RelatedProduct[] = [
      createRelatedProduct({ goodBetterBest: undefined })
    ];

    render(
      <ThemeProvider>
        <RelatedProducts countryCode="en" products={relatedProducts} />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("tag-indicator-best")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("tag-indicator-better")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tag-indicator-good")).not.toBeInTheDocument();
  });
});
