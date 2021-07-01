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

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

const transformProduct = (product: Partial<Product>): ProductVariant[] =>
  require("../transform").transformProduct(product as Product);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("transformProduct", () => {
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
          (classification) => classification.code === "scoringWeightAttributes"
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
