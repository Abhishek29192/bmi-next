import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import createClassification from "../../__tests__/helpers/ClassificationHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import ProductTechnicalSpec from "../ProductTechnicalSpec";
import { SiteContextProvider } from "../Site";
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
  });
});
