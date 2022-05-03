import React from "react";
import { render, screen } from "@testing-library/react";
import ProductTechnicalSpec from "../ProductTechnicalSpec";
import { Classification, ClassificationCodeEnum } from "../types/pim";
import { SiteContextProvider } from "../Site";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
      value={{
        node_locale: "en-UK",
        homePage: { title: "Home Page" },
        getMicroCopy: (path) =>
          path === "pdp.noTechSpecMessage"
            ? "No technical specifications found for this product."
            : `MC: ${path}`,
        countryCode: "uk",
        reCaptchaKey: "1234",
        reCaptchaNet: false
      }}
    >
      {children}
    </SiteContextProvider>
  );
};

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
    describe("with microcopy text", () => {
      it("when no classifications and microcopy text is provided", () => {
        const namespace = "bmi.classification.namespace";
        const wrapper = render(
          <MockSiteContext>
            <ProductTechnicalSpec
              classifications={[]}
              classificationNamespace={namespace}
            />
          </MockSiteContext>
        );
        expect(wrapper.baseElement).toMatchSnapshot();
      });
    });

    describe("when One classifications provided", () => {
      it("With no feature units", () => {
        const namespace = "bmi.classification.namespace";
        const classifications: Classification[] = [
          {
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
            features: [
              {
                name: "feature1",
                code: "feature-code1",
                featureValues: [{ code: "height", value: "200" }]
              }
            ]
          },
          {
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
            name: ClassificationCodeEnum.MEASUREMENTS,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
  it("shouldn't render variant attribute if classification.code === 'appearanceAttributes' and isSingleVariant === true ", async () => {
    const namespace = "bmi.classification.namespace";
    const classifications: Classification[] = [
      {
        features: [
          {
            name: "Farge",
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
            featureValues: [
              {
                value: "Grå",
                code: null
              }
            ],
            featureUnit: null
          },
          {
            name: "Farge",
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
            featureValues: [
              {
                value: "Grå",
                code: "GREY"
              }
            ],
            featureUnit: null
          }
        ],
        name: "Farge og overflate",
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE
      },
      {
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,

        features: [
          {
            name: "feature1",
            code: "feature-code1",
            featureValues: [{ code: "height", value: "200" }]
          }
        ]
      },
      {
        name: ClassificationCodeEnum.MEASUREMENTS,
        code: ClassificationCodeEnum.MEASUREMENTS,
        features: [
          {
            name: "c2-feature1",
            code: "c2-feature-code1",
            featureValues: [{ code: "height", value: "200" }]
          }
        ]
      }
    ];
    render(
      <ProductTechnicalSpec
        classifications={classifications}
        classificationNamespace={namespace}
        isSingleVariant={true}
      />
    );
    const appearanceAttributeButton = screen.queryByText("Farge og overflate");
    expect(appearanceAttributeButton).not.toBeInTheDocument();
  });
});
