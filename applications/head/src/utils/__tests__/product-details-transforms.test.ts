import {
  findProductBrandLogoCode,
  getMergedClassifications,
  getProductUrl,
  getValidClassification,
  getValidFeatures
} from "../product-details-transforms";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import createProduct, {
  createBaseProduct
} from "../../__tests__/PimDocumentProductHelper";
import createCategory from "../../__tests__/CategoryHelper";

describe("product-details-transforms tests", () => {
  describe("getProductUrl tests", () => {
    describe("When country code and path is provided", () => {
      it("returns formatted url", () => {
        const countryCode = "en";
        const path = "test.com/product/1";
        const expectedResult = `/${countryCode}/${path}`;
        const result = getProductUrl(countryCode, path);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("findProductBrandLogoCode tests", () => {
    describe("When Product with BMI Brands is NOT provided", () => {
      it("returns brand logo code", () => {
        const result = findProductBrandLogoCode(
          createBaseProduct({
            categories: [
              createCategory({
                code: "ICOPAL",
                parentCategoryCode: "NOT_BMI_BRANDS_CATEGORY"
              })
            ]
          })
        );
        expect(result).toEqual(undefined);
      });
    });
    describe("When Product with BMI Brands is provided", () => {
      it("returns brand logo code", () => {
        const result = findProductBrandLogoCode(
          createBaseProduct({
            categories: [
              createCategory({
                code: "ICOPAL",
                parentCategoryCode: "BMI_Brands"
              })
            ]
          })
        );
        expect(result).toEqual("ICOPAL");
      });
    });
  });

  describe("getMergedClassifications tests", () => {
    describe("When emtpy classifications are provided", () => {
      it("returns empty results", () => {
        const result = getMergedClassifications(
          "",
          createBaseProduct({ classifications: undefined }),
          createBaseProduct({ classifications: undefined })
        );
        expect(result).toEqual([]);
      });
    });
    describe("When classifications on self product and parent prodcut then", () => {
      it("returns merged classifications results", () => {
        const expectedResult = [
          {
            code: "product-code-1",
            features: [
              {
                code: "classification-feature-code",
                featureUnit: {
                  name: "classification-feature-feature-unit-name",
                  symbol: "classification-feature-feature-unit-symbol",
                  unitType: "classification-feature-feature-unit-unit-type"
                },
                featureValues: [
                  {
                    code: "classification-feature-feature-value-code",
                    value: "classification-feature-feature-value-value"
                  }
                ],
                name: "classification-feature-name"
              }
            ],
            name: "classification-name"
          }
        ];
        const result = getMergedClassifications(
          "",
          createBaseProduct(),
          createBaseProduct({
            classifications: [createClassification({ code: "product-code-1" })]
          })
        );
        expect(result).toEqual(expectedResult);
      });
    });
  });
  describe("getValidClassification tests", () => {
    describe("When emtpy classifications are provided", () => {
      it("returns empty results", () => {
        const result = getValidClassification("", []);
        expect(result).toEqual([]);
      });
    });
    describe("When Classifications with ONLY ignored attributes are provided", () => {
      it("removes ignored classifications", () => {
        const classification1 = createClassification({
          features: [
            createFeature({
              code: "/scoringWeightAttributes.scoringweight",
              name: "scoringweight"
            })
          ]
        });
        const classification2 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.colourfamily",
              name: "colourfamily"
            })
          ]
        });
        const result = getValidClassification("", [
          classification1,
          classification2
        ]);
        expect(result).toEqual([]);
      });
    });
    describe("When Classifications with mixed ignored attributes are provided", () => {
      it("returns valid classifications", () => {
        const classification1 = createClassification({
          features: [
            createFeature({
              code: "/scoringWeightAttributes.scoringweight",
              name: "scoringweight"
            })
          ]
        });
        const classification2 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.colourfamily",
              name: "colourfamily"
            })
          ]
        });
        const classification3 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.weight",
              name: "weight"
            })
          ]
        });
        const result = getValidClassification("", [
          classification1,
          classification2,
          classification3
        ]);
        expect(result).toEqual([classification3]);
      });
    });
  });
  describe("getValidFeatures tests", () => {
    describe("When emtpy features are provided", () => {
      it("returns empty results", () => {
        const result = getValidFeatures("", []);
        expect(result).toEqual([]);
      });
    });

    describe("When features with ONLY ignored attributes are provided", () => {
      it("removes ignored features", () => {
        const feature1 = createFeature({
          code: "/scoringWeightAttributes.scoringweight",
          name: "scoringweight"
        });
        const feature2 = createFeature({
          code: "/appearanceAttributes.colourfamily",
          name: "colourfamily"
        });
        const result = getValidFeatures("", [feature1, feature2]);
        expect(result).toEqual([]);
      });
    });

    describe("When features with mixed ignored attributes are provided", () => {
      it("returns valid features", () => {
        const feature1 = createFeature({
          code: "/scoringWeightAttributes.scoringweight",
          name: "scoringweight"
        });
        const feature2 = createFeature({
          code: "/appearanceAttributes.colourfamily",
          name: "colourfamily"
        });
        const feature3 = createFeature({
          code: "/appearanceAttributes.weight",
          name: "weight"
        });
        const result = getValidFeatures("", [feature1, feature2, feature3]);
        expect(result).toEqual([feature3]);
      });
    });
  });
});
