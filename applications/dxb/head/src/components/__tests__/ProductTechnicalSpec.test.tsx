import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import createClassification from "../../__tests__/helpers/ClassificationHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import ProductTechnicalSpec from "../ProductTechnicalSpec";
import { SiteContextProvider } from "../Site";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
      value={{
        ...getMockSiteContext("uk", "en-UK"),
        homePage: { title: "Home Page" },
        getMicroCopy: (path) =>
          path === "pdp.noTechSpecMessage"
            ? "No technical specifications found for this product."
            : `MC: ${path}`,
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
      const product = createProduct({ classifications: [] });
      const { baseElement } = render(
        <ThemeProvider>
          <ProductTechnicalSpec product={product} />
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });
    describe("with microcopy text", () => {
      it("when no classifications and microcopy text is provided", () => {
        const product = createProduct({ classifications: [] });
        const { baseElement } = render(
          <ThemeProvider>
            <MockSiteContext>
              <ProductTechnicalSpec product={product} />
            </MockSiteContext>
          </ThemeProvider>
        );
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe("when One classifications provided", () => {
      it("With no feature units", () => {
        const product = createProduct({
          classifications: [
            createClassification({
              features: [{ name: "feature1", value: "200" }]
            })
          ]
        });
        const { baseElement } = render(
          <ThemeProvider>
            <ProductTechnicalSpec product={product} />
          </ThemeProvider>
        );
        expect(baseElement).toMatchSnapshot();
      });

      it("With a feature units", () => {
        const product = createProduct({
          classifications: [
            createClassification({
              features: [{ name: "feature1", value: "200mm" }]
            })
          ]
        });

        const { baseElement } = render(
          <ThemeProvider>
            <ProductTechnicalSpec product={product} />
          </ThemeProvider>
        );
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe("when Multiple classifications provided", () => {
      it("With no feature units", () => {
        const product = createProduct({
          classifications: [
            createClassification({
              features: [
                { name: "feature1", value: "100mm" },
                { name: "feature1", value: "200mm" }
              ]
            })
          ]
        });
        const { baseElement } = render(
          <ThemeProvider>
            <ProductTechnicalSpec product={product} />
          </ThemeProvider>
        );
        expect(baseElement).toMatchSnapshot();
      });

      it("With more than one feature units", () => {
        const product = createProduct({
          classifications: [
            createClassification({
              features: [
                { name: "measurement", value: "100mm" },
                { name: "measurement", value: "200mm" }
              ]
            })
          ]
        });
        const { baseElement } = render(
          <ThemeProvider>
            <ProductTechnicalSpec product={product} />
          </ThemeProvider>
        );
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe("classification ordering", () => {
      const products = createProduct({
        classifications: [
          createClassification({
            name: "secondClassProduct",
            features: [{ name: "feature1", value: "200" }]
          }),
          createClassification({
            name: "firstClassProduct",
            features: [{ name: "feature1", value: "200" }]
          })
        ]
      });

      describe("When the 'enable product attribute ordering' feature flag is set as true", () => {
        it("should sort classification by name", () => {
          process.env.GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING =
            "true";

          render(
            <ConfigProvider
              configOverride={{
                enableProductClassificationAttributeOrdering: true
              }}
            >
              <ThemeProvider>
                <ProductTechnicalSpec product={products} />
              </ThemeProvider>
            </ConfigProvider>
          );
          const classificationName = screen.getAllByRole("heading", {
            level: 6
          });
          expect(classificationName[0].textContent).toBe("firstClassProduct");
        });
      });

      describe("When the 'enable product attribute ordering' feature flag is set as false", () => {
        it("should NOT sort classification by name", () => {
          process.env.GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING =
            "false";

          render(
            <ConfigProvider
              configOverride={{
                enableProductClassificationAttributeOrdering: false
              }}
            >
              <ThemeProvider>
                <ProductTechnicalSpec product={products} />
              </ThemeProvider>
            </ConfigProvider>
          );
          const classificationName = screen.getAllByRole("heading", {
            level: 6
          });
          expect(classificationName[0].textContent).toBe("secondClassProduct");
        });
      });

      describe("When the 'enable product attribute ordering' feature flag is NOT set", () => {
        it("should NOT sort classification by name", () => {
          process.env.GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING =
            "";

          render(
            <ConfigProvider
              configOverride={{
                enableProductClassificationAttributeOrdering: false
              }}
            >
              <ThemeProvider>
                <ProductTechnicalSpec product={products} />
              </ThemeProvider>
            </ConfigProvider>
          );
          const classificationName = screen.getAllByRole("heading", {
            level: 6
          });
          expect(classificationName[0].textContent).toBe("secondClassProduct");
        });
      });
    });
  });
});
