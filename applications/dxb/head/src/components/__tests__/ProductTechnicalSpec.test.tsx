import React from "react";
import { render } from "@testing-library/react";
import ProductTechnicalSpec from "../ProductTechnicalSpec";
import { Classification } from "../types/pim";

describe("ProductTechnicalSpec component", () => {
  describe("Renders correctly", () => {
    it("when no classifications provided", () => {
      const namespace = "bmi.classification.namespace";
      const wrapper = render(
        <ProductTechnicalSpec
          classifications={[]}
          classificationNamespace={namespace}
        />
      );
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    describe("when One classifications provided", () => {
      it("With no feature units", () => {
        const namespace = "bmi.classification.namespace";
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "class-code",
            features: [
              {
                name: "feature1",
                code: "feature-code1",
                featureValues: [{ code: "height", value: "200" }]
              }
            ]
          }
        ];
        const wrapper = render(
          <ProductTechnicalSpec
            classifications={classifications}
            classificationNamespace={namespace}
          />
        );
        expect(wrapper.baseElement).toMatchSnapshot();
      });

      it("With a feature units", () => {
        const namespace = "bmi.classification.namespace";
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "class-code",
            features: [
              {
                name: "feature1",
                code: "feature-code1",
                featureValues: [{ code: "height", value: "200" }],
                featureUnit: {
                  name: "height",
                  symbol: "in",
                  unitType: "metric"
                }
              }
            ]
          }
        ];
        const wrapper = render(
          <ProductTechnicalSpec
            classifications={classifications}
            classificationNamespace={namespace}
          />
        );
        expect(wrapper.baseElement).toMatchSnapshot();
      });
    });

    describe("when Multiple classifications provided", () => {
      it("With no feature units", () => {
        const namespace = "bmi.classification.namespace";
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "class-code",
            features: [
              {
                name: "feature1",
                code: "feature-code1",
                featureValues: [{ code: "height", value: "200" }]
              }
            ]
          },
          {
            name: "class2",
            code: "class-code-2",
            features: [
              {
                name: "c2-feature1",
                code: "c2-feature-code1",
                featureValues: [{ code: "height", value: "200" }]
              }
            ]
          }
        ];
        const wrapper = render(
          <ProductTechnicalSpec
            classifications={classifications}
            classificationNamespace={namespace}
          />
        );
        expect(wrapper.baseElement).toMatchSnapshot();
      });

      it("With more than one feature units", () => {
        const namespace = "bmi.classification.namespace";
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "class-code",
            features: [
              {
                name: "feature1",
                code: "feature-code1",
                featureValues: [{ code: "height", value: "200" }],
                featureUnit: {
                  name: "height",
                  symbol: "in",
                  unitType: "metric"
                }
              },
              {
                name: "feature2",
                code: "feature-code2",
                featureValues: [{ code: "height", value: "200" }],
                featureUnit: {
                  name: "height",
                  symbol: "in",
                  unitType: "metric"
                }
              }
            ]
          },
          {
            name: "class2",
            code: "class2-code",
            features: [
              {
                name: "class2-feature1",
                code: "class2-feature-code1",
                featureValues: [{ code: "height", value: "200" }],
                featureUnit: {
                  name: "height",
                  symbol: "in",
                  unitType: "metric"
                }
              },
              {
                name: "class2-feature2",
                code: "class2-feature-code2",
                featureValues: [{ code: "height", value: "200" }],
                featureUnit: {
                  name: "height",
                  symbol: "in",
                  unitType: "metric"
                }
              }
            ]
          }
        ];
        const wrapper = render(
          <ProductTechnicalSpec
            classifications={classifications}
            classificationNamespace={namespace}
          />
        );
        expect(wrapper.baseElement).toMatchSnapshot();
      });
    });
  });
});
