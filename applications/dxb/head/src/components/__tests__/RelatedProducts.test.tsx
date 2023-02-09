import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
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

    const { container, getByTestId } = render(
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

    expect(getByTestId("GTMOverviewCard").getAttribute("data-gtm")).toEqual(
      expectedDataGtm
    );
  });
});
