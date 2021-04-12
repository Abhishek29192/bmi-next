import { pick } from "lodash";
import { config } from "dotenv";
import type {
  Product as PIMProduct,
  VariantOption as PIMVariant
} from "./types/pim";
import type { ProductVariant as ESProduct } from "./types/elasticSearch";
import {
  findProductBrandLogoCode,
  getFullCategoriesPaths,
  getGroupCategory,
  getLeafCategory,
  getSizeLabel,
  mapProductClassifications,
  TransformedMeasurementValue
} from "./CLONE";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const {
  // TODO: Remove this fallback once the environment variable is correctly set.
  PIM_CLASSIFICATION_CATALOGUE_NAMESPACE = "bmiClassificationCatalog/1.0"
} = process.env;

// Combines all the classification representing a variant, which includes the classifications from base product, which are overwritten by variant ones.
const combineVariantClassifications = (
  product: PIMProduct,
  variant: PIMVariant
) => {
  const baseClassifications = product.classifications || [];
  // scoringWeightAttributes is special in that we ignore it in variants
  // it may or may not appear in base, but variant's is ignored
  const variantClassifications = (variant.classifications || []).filter(
    ({ code }) => code !== "scoringWeightAttributes"
  );

  const allClassificationsMap = new Map(
    [
      ...baseClassifications,
      ...variantClassifications
    ].map((classification) => [classification.code, classification])
  );

  return Array.from(allClassificationsMap.values());
};

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  const mappedClassifications = mapProductClassifications(
    product,
    PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
  );

  return (product.variantOptions || []).map((variant) => {
    // Only "Category" categories which are used for filters
    const productLeafCategories = getFullCategoriesPaths(
      product.categories || []
    ).map((categoryBranch) => {
      const parent = getGroupCategory(categoryBranch);
      const leaf = getLeafCategory(categoryBranch);

      return {
        parentCategoryCode: parent.code,
        code: leaf.code
      };
    });

    // Any category that is not "category" type
    // Keeping this because there are Brand and ProductFamily categories which are important
    // TODO: save as individual Brand and ProductFamily?
    const productFamilyCategories = (product.categories || []).filter(
      ({ categoryType }) => categoryType === "ProductFamily"
    );
    const productLineCategories = (product.categories || []).filter(
      ({ categoryType }) => categoryType === "ProductLine"
    );

    const classifications = combineVariantClassifications(product, variant);
    const scoringWeightClassification = classifications.find(
      ({ code }) => code === "scoringWeightAttributes"
    );
    const scoringWeight =
      scoringWeightClassification?.features?.[0]?.featureValues?.[0]?.value;

    const baseAttributes = pick(
      { ...product, ...variant },
      "approvalStatus",
      "externalProductCode",
      "code",
      "isSampleOrderAllowed",
      "name",
      "summary",
      "description",
      "longDescription",
      "shortDescription",
      "productBenefits"
    );

    const appearanceClassifications = classifications.find(
      ({ code }) => code === "appearanceAttributes"
    );

    // Codes used for matching against filter codes
    // Values used for matching against search strings (localised input)
    // TODO: Perhaps refactor into objects
    let colourfamilyCode,
      colourfamilyValue,
      materialsCode,
      materialsValue,
      texturefamilyCode,
      texturefamilyValue,
      // Measurement doesn't need a code for filters at the moment
      measurementValue;

    if (appearanceClassifications) {
      const colourfamilyAppearance = (
        appearanceClassifications.features || []
      ).find(
        ({ code }) =>
          code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`
      )?.featureValues?.[0];

      colourfamilyCode = colourfamilyAppearance?.code;
      colourfamilyValue = colourfamilyAppearance?.value;

      const materialsGeneralInformation = (
        appearanceClassifications.features || []
      ).find(
        ({ code }) =>
          code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`
      )?.featureValues?.[0];

      materialsCode = materialsGeneralInformation?.code;
      materialsValue = materialsGeneralInformation?.value;

      const texturefamilyAppearance = (
        appearanceClassifications.features || []
      ).find(
        ({ code }) =>
          code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.texturefamily`
      )?.featureValues?.[0];

      texturefamilyCode = texturefamilyAppearance?.code;
      texturefamilyValue = texturefamilyAppearance?.value;
    }

    const measurementsClassification =
      mappedClassifications[variant.code]?.measurements;
    if (measurementsClassification) {
      measurementValue = getSizeLabel(
        measurementsClassification as TransformedMeasurementValue
      );
    }

    return {
      ...baseAttributes,
      code: variant.code,
      baseProduct: product,
      brandCode: findProductBrandLogoCode(product),
      // TODO: Perhaps we're only interested in specific images?
      images: [...(variant.images || []), ...(product.images || [])],
      categories: productLeafCategories,
      // All cats, PLP could be by any type of cat, Brand and ProductFamily cats here are important
      allCategories: product.categories || [],
      // Used for main category filter on PLP, interested in only leaf Categories and ProductCategories
      plpCategories: [
        ...productLeafCategories,
        ...productFamilyCategories,
        ...productLineCategories
      ],
      classifications,
      // Special because we want to use it for sorting, atm this seems easier
      scoringWeight,
      // Parsing to a number so it'll be mapped as integer (long).
      // @todo: Eventually to be swapped out with scoringWeight when changes have been propagated.
      scoringWeightInt: Number.isFinite(Number.parseInt(scoringWeight))
        ? Number.parseInt(scoringWeight)
        : 0,
      colourfamilyCode,
      colourfamilyValue,
      texturefamilyCode,
      texturefamilyValue,
      materialsCode,
      materialsValue,
      measurementValue
    };
  });
};
