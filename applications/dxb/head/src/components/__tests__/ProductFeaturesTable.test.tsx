import { ThemeProvider } from "@bmi-digital/components";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { Feature } from "../../types/pim";
import ProductFeaturesTable from "../ProductFeaturesTable";
import { ConfigProvider } from "../../contexts/ConfigProvider";

const features: Feature[] = [
  {
    name: "feature1",
    value: "200"
  },
  {
    name: "feature-2",
    value: "300"
  }
];

describe("ProductFeaturesTable component", () => {
  describe("Renders correctly", () => {
    it("When no features provided", () => {
      const { baseElement } = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder features={[]} />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("With default row pattern color", () => {
      const { baseElement } = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder features={features} />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("With default row pattern color and with border", () => {
      const { baseElement } = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder={false} features={features} />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("With header row", () => {
      const { baseElement } = render(
        <ThemeProvider>
          <ProductFeaturesTable
            hasNoBorder={false}
            features={features}
            HeadRow={<div>Header Row</div>}
          />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("With even row pattern color", () => {
      const { baseElement } = render(
        <ThemeProvider>
          <ProductFeaturesTable
            hasNoBorder
            features={features}
            rowBgColorPattern="even"
          />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    describe("attribute ordering", () => {
      const feature: Feature = {
        name: "Zebra",
        value: "onion"
      };

      describe("When the 'enable product attribute ordering' feature flag is set", () => {
        it("should sort features by name", () => {
          process.env.GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING =
            "true";

          const unsortedFeatures: Feature[] = [feature, ...features];

          render(
            <ConfigProvider
              configOverride={{
                enableProductClassificationAttributeOrdering: true
              }}
            >
              <ThemeProvider>
                <ProductFeaturesTable hasNoBorder features={unsortedFeatures} />
              </ThemeProvider>
            </ConfigProvider>
          );

          const rows = screen.getAllByRole("row");
          const [lastRow] = [...rows].slice(-1);

          expect(
            within(lastRow).getByRole("cell", { name: feature.name })
          ).toBeInTheDocument();
        });
      });

      describe("When the 'enable product attribute ordering' feature flag is NOT set", () => {
        it("should NOT sort features by name", () => {
          const unsortedFeatures: Feature[] = [feature, ...features];

          render(
            <ConfigProvider
              configOverride={{
                enableProductClassificationAttributeOrdering: false
              }}
            >
              <ThemeProvider>
                <ProductFeaturesTable hasNoBorder features={unsortedFeatures} />
              </ThemeProvider>
            </ConfigProvider>
          );

          const [firstRow] = screen.getAllByRole("row");

          expect(
            within(firstRow).getByRole("cell", { name: feature.name })
          ).toBeInTheDocument();
        });
      });
    });
  });
});
