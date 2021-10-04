import mockConsole from "jest-mock-console";
import { ProductVariant } from "../es-model";
import { Product } from "../pim";
import {
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureValue,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification
} from "./helpers/ClassificationHelper";
import createVariantOption from "./helpers/VariantOptionHelper";
import createPimProduct from "./helpers/PimProductHelper";
import createCategory from "./helpers/CategoryHelper";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

const transformProduct = (product: Partial<Product>): ProductVariant[] =>
  require("../transformProducts").transformProduct(product as Product);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("transformProduct", () => {
  describe("stratigic transform tests", () => {
    it("should transform single Categorytype 'Category'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [createCategory()]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = transformedProduct[0]["Category"];
      expect(categoryAsProp).toEqual([{ code: "code", name: "name" }]);
    });

    it("should transform multiple Categorytype 'Category'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()]
      });
      const transformedProduct = transformProduct(product);
      const newFeatureValueAsProp = transformedProduct[0]["Category"];

      expect(newFeatureValueAsProp).toEqual([
        { code: "parent-category-code", name: "name" },
        { code: "code", name: "name" },
        { code: "BMI-brand-code", name: "name" }
      ]);
    });

    it("should transform single Categorytype 'ProductLine'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "ProductLine",
            code: "RoofTiles",
            name: "Roof Tiles"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = transformedProduct[0]["ProductLine"];
      expect(categoryAsProp).toEqual([
        { code: "RoofTiles", name: "Roof Tiles" }
      ]);
    });
    it("should transform single Categorytype 'ProductFamily'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "ProductFamily",
            code: "Tiles",
            name: "Tiles"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = transformedProduct[0]["ProductFamily"];
      expect(categoryAsProp).toEqual([{ code: "Tiles", name: "Tiles" }]);
    });

    it("should transform single Categorytype 'Brand'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "Brand",
            code: "Aerodek",
            name: "Aerodek"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = transformedProduct[0]["Brand"];
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);
    });

    it("should transform single feature values from a variant classification", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const featureNameAsProp = transformedProduct[0]["measurements.width"];

      expect(featureNameAsProp).toEqual([
        { code: "100symbol", name: "100 symbol" }
      ]);
    });

    it("should transform multiple feature values from a variant classification", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [
                      createFeatureValue({ value: "100" }),
                      createFeatureValue({ value: "200" })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const featureNameAsProp = transformedProduct[0]["measurements.height"];

      expect(featureNameAsProp).toEqual([
        { code: "100symbol", name: "100 symbol" },
        { code: "200symbol", name: "200 symbol" }
      ]);
    });

    it("should transform nothing into measurementValue if not width, length or height", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.something`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toBeUndefined();
    });

    it("should transform width into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100symbol");
    });

    it("should transform length into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: [createFeatureValue({ value: "10" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("10symbol");
    });

    it("should transform height into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "1" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("1symbol");
    });

    it("should transform width, legnth and height into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "10" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: [createFeatureValue({ value: "1" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100x1x10symbol");
    });
  });

  describe("original transform tests", () => {
    it("should transform full product with single variant to a single ES product", () => {
      const product = createPimProduct();

      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should default PIM_CLASSIFICATION_CATALOGUE_NAMESPACE if not provided", () => {
      const pimClassificationCcatalogueNamespace =
        process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;
      delete process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

      const product = createPimProduct();

      expect(transformProduct(product)).toMatchSnapshot();

      process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE =
        pimClassificationCcatalogueNamespace;
    });

    it("should ignore variant scoringWeightAttributes", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createScoringWeightAttributesClassification({
                features: [
                  createFeature({
                    featureValues: [createFeatureValue({ value: "2.0" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualScoringWeightAttributes = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "scoringWeightAttributes"
      );
      const expectedScoringWeightAttributes = product.classifications!.filter(
        (classification) => classification.code === "scoringWeightAttributes"
      );
      expect(expectedScoringWeightAttributes).not.toEqual(
        product.variantOptions!.filter((variant) =>
          variant.classifications!.filter(
            (classification) =>
              classification.code === "scoringWeightAttributes"
          )
        )
      );
      expect(actualScoringWeightAttributes).toEqual(
        expectedScoringWeightAttributes
      );
    });

    it("should override product appearanceAttributes classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createAppearanceAttributesClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`,
                    featureValues: [createFeatureValue({ value: "green" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.texturefamily`,
                    featureValues: [createFeatureValue({ value: "matte" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualAppearanceAttributes = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "appearanceAttributes"
      );
      const expectedAppearanceAttributes = product.variantOptions!.flatMap(
        (variant) =>
          variant.classifications!.filter(
            (classification) => classification.code === "appearanceAttributes"
          )
      );
      expect(expectedAppearanceAttributes).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "appearanceAttributes"
        )
      );
      expect(actualAppearanceAttributes).toEqual(expectedAppearanceAttributes);
    });

    it("should override product generalInformation classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createGeneralInformationClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`,
                    featureValues: [createFeatureValue({ value: "clay" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualGeneralInformation = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "generalInformation"
      );
      const expectedGeneralInformation = product.variantOptions!.flatMap(
        (variantOption) =>
          variantOption.classifications!.filter(
            (classification) => classification.code === "generalInformation"
          )
      );
      expect(expectedGeneralInformation).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "generalInformation"
        )
      );
      expect(actualGeneralInformation).toEqual(expectedGeneralInformation);
    });

    it("should override product measurements classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualGeneralInformation = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "measurements"
      );
      const expectedGeneralInformation = product.variantOptions!.flatMap(
        (variantOption) =>
          variantOption.classifications!.filter(
            (classification) => classification.code === "measurements"
          )
      );
      expect(expectedGeneralInformation).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "measurements"
        )
      );
      expect(actualGeneralInformation).toEqual(expectedGeneralInformation);
    });

    it("should override product approvalStatus with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            approvalStatus: "unapproved"
          })
        ]
      });
      const actualApprovalStatus = transformProduct(product)[0].approvalStatus;
      const expectedApprovalStatus = product.variantOptions![0].approvalStatus;
      expect(expectedApprovalStatus).not.toEqual(product.approvalStatus);
      expect(actualApprovalStatus).toEqual(expectedApprovalStatus);
    });

    it("should handle no classifications", () => {
      const product = createPimProduct({
        classifications: undefined,
        variantOptions: [
          createVariantOption({
            classifications: undefined
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle appearanceAttributes classifications with no features", () => {
      const product = createPimProduct({
        classifications: [
          createAppearanceAttributesClassification({ features: undefined })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createAppearanceAttributesClassification({
                features: undefined
              })
            ]
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle generalInformation classifications with no features", () => {
      const product = createPimProduct({
        classifications: [
          createGeneralInformationClassification({ features: undefined })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createGeneralInformationClassification({
                features: undefined
              })
            ]
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle no categories", () => {
      const product = createPimProduct({
        categories: undefined
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle no images", () => {
      const product = createPimProduct({
        images: undefined,
        variantOptions: [
          createVariantOption({
            images: undefined
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should return an empty array if there are no variants", () => {
      const product = createPimProduct({
        variantOptions: undefined
      });
      expect(transformProduct(product)).toStrictEqual([]);
    });
  });
});
