import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { Feature } from "../../types/pim";
import ProductFeaturesTable from "../ProductFeaturesTable";

describe("ProductFeaturesTable component", () => {
  describe("Renders correctly", () => {
    it("When no features provided", () => {
      const wrapper = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder features={[]} />
        </ThemeProvider>
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With default row pattern color", () => {
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

      const wrapper = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder features={features} />
        </ThemeProvider>
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With default row pattern color and with border", () => {
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

      const wrapper = render(
        <ThemeProvider>
          <ProductFeaturesTable hasNoBorder={false} features={features} />
        </ThemeProvider>
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With header row", () => {
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

      const wrapper = render(
        <ThemeProvider>
          <ProductFeaturesTable
            hasNoBorder={false}
            features={features}
            HeadRow={<div>Header Row</div>}
          />
        </ThemeProvider>
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With even row pattern color", () => {
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

      const wrapper = render(
        <ThemeProvider>
          <ProductFeaturesTable
            hasNoBorder
            features={features}
            rowBgColorPattern="even"
          />
        </ThemeProvider>
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });
});
