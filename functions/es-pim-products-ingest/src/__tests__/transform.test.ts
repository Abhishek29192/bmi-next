import {
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureValue,
  createGeneralInformationClassification,
  createScoringWeightAttributesClassification
} from "../../test/ClassificationHelper";
import createVariantOption from "../../test/VariantOptionHelper";
import createPimProduct from "../../test/PimProductHelper";
import { transformProduct } from "../transform";
import { ProductVariant } from "../types/elasticSearch";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

describe("transformProduct", () => {
  it("should transform full product with single variant to a single ES product", () => {
    const product = createPimProduct();
    const expectedScoringWeight = product.classifications.find(
      (classification) => classification.code === "scoringWeightAttributes"
    ).features[0].featureValues[0].value;
    const expectedColour = product.classifications
      .find((classification) => classification.code === "appearanceAttributes")
      .features.find(
        (feature) =>
          feature.code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`
      ).featureValues[0];
    const expectedTexture = product.classifications
      .find((classification) => classification.code === "appearanceAttributes")
      .features.find(
        (feature) =>
          feature.code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.texturefamily`
      ).featureValues[0];
    const expectedMaterial = product.classifications
      .find((classification) => classification.code === "generalInformation")
      .features.find(
        (feature) =>
          feature.code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`
      ).featureValues[0];

    const expectedEsProduct: ProductVariant = {
      code: product.variantOptions[0].code,
      baseProduct: product,
      brandCode: product.categories.find(
        (category) => category.parentCategoryCode === "BMI_Brands"
      ).code,
      images: product.images,
      categories: [],
      allCategories: [],
      plpCategories: [],
      classifications: [
        ...product.classifications,
        ...product.variantOptions.flatMap((variant) => variant.classifications)
      ],
      scoringWeight: expectedScoringWeight,
      scoringWeightInt: Number.parseInt(expectedScoringWeight),
      colourfamilyCode: expectedColour.code,
      colourfamilyValue: expectedColour.value,
      texturefamilyCode: expectedTexture.code,
      texturefamilyValue: expectedTexture.value,
      materialsCode: expectedMaterial.code,
      materialsValue: expectedMaterial.value,
      measurementValue: "",
      approvalStatus: product.approvalStatus
    };
    expect(transformProduct(product)).toEqual([expectedEsProduct]);
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
    const expectedScoringWeightAttributes = product.classifications.filter(
      (classification) => classification.code === "scoringWeightAttributes"
    );
    expect(expectedScoringWeightAttributes).not.toEqual(
      product.variantOptions.filter((variant) =>
        variant.classifications.filter(
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
    const expectedAppearanceAttributes = product.classifications.filter(
      (classification) => classification.code === "appearanceAttributes"
    );
    expect(expectedAppearanceAttributes).not.toEqual(
      product.variantOptions.filter((variant) =>
        variant.classifications.filter(
          (classification) => classification.code === "appearanceAttributes"
        )
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
    const expectedGeneralInformation = product.classifications.filter(
      (classification) => classification.code === "generalInformation"
    );
    expect(expectedGeneralInformation).not.toEqual(
      product.variantOptions.filter((variant) =>
        variant.classifications.filter(
          (classification) => classification.code === "generalInformation"
        )
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
    const expectedApprovalStatus = product.variantOptions[0].approvalStatus;
    expect(expectedApprovalStatus).not.toEqual(product.approvalStatus);
    expect(actualApprovalStatus).toEqual(expectedApprovalStatus);
  });
});
