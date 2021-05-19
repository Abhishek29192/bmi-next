import React from "react";
import { render } from "@testing-library/react";
import ProductFeaturesTable from "../ProductFeaturesTable";
import { ClassificationFeature } from "../types/ProductBaseTypes";

describe("ProductFeaturesTable component", () => {
  describe("Renders correctly", () => {
    it("When no features provided", () => {
      const wrapper = render(<ProductFeaturesTable features={[]} />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With default row pattern color", () => {
      const features: ClassificationFeature[] = [
        {
          name: "feature1",
          code: "feature1-code1",
          featureValues: [{ code: "height-1", value: "200" }]
        },
        {
          name: "feature-2",
          code: "feature2-code1",
          featureValues: [{ code: "height-2", value: "300" }]
        }
      ];

      const wrapper = render(<ProductFeaturesTable features={features} />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("With even row pattern color", () => {
      const features: ClassificationFeature[] = [
        {
          name: "feature1",
          code: "feature1-code1",
          featureValues: [{ code: "height-1", value: "200" }]
        },
        {
          name: "feature-2",
          code: "feature2-code1",
          featureValues: [{ code: "height-2", value: "300" }]
        }
      ];

      const wrapper = render(
        <ProductFeaturesTable features={features} rowBgColorPattern="even" />
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });
});
