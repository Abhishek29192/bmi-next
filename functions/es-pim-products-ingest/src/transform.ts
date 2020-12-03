import _ from "lodash";
import type {
  Product as PIMProduct,
  VariantOption as PIMVariant
} from "./types/pim";
import type { ProductVariant as ESProduct } from "./types/elasticSearch";
import {
  findProductBrandLogoCode,
  getFullCategoriesPaths,
  getGroupCategory,
  getLeafCategory
} from "./CLONE";

// Combines all the classification representing a variant, which includes the classifications from base product, which are overwritten by variant ones.
const combineVariantClassifications = (
  product: PIMProduct,
  variant: PIMVariant
) => {
  const baseClassifications = product.classifications || [];
  const variantClassifications = variant.classifications || [];

  const allClassificationsMap = new Map(
    [
      ...baseClassifications,
      ...variantClassifications
    ].map((classification) => [classification.code, classification])
  );

  return Array.from(allClassificationsMap.values());
};

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  return (product.variantOptions || []).map((variant) => {
    const productCategories = getFullCategoriesPaths(
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
    const otherCategories = (product.categories || []).filter(
      ({ categoryType }) => categoryType !== "Category"
    );

    const classifications = combineVariantClassifications(product, variant);
    const scoringWeightClassification = classifications.find(
      ({ code }) => code === "scoringWeightAttributes"
    );
    const scoringWeight =
      scoringWeightClassification?.features?.[0]?.featureValues?.[0]?.value;

    const baseAttributes = _.pick(
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

    let colourfamilyCode, texturefamilyCode;

    if (appearanceClassifications) {
      colourfamilyCode = (appearanceClassifications.features || []).find(
        ({ code }) =>
          code ===
          `bmiNorwayClassificationCatalog/1.0/appearanceAttributes.colourfamily`
      )?.featureValues?.[0]?.code;
      texturefamilyCode = (appearanceClassifications.features || []).find(
        ({ code }) =>
          code ===
          `bmiNorwayClassificationCatalog/1.0/appearanceAttributes.texturefamily`
      )?.featureValues?.[0]?.code;
    }

    return {
      ...baseAttributes,
      code: variant.code,
      baseProduct: product,
      brandCode: findProductBrandLogoCode(product),
      // TODO: Perhaps we're only interested in specific images?
      images: [...(variant.images || []), ...(product.images || [])],
      categories: productCategories,
      otherCategories,
      classifications,
      // Special because we want to use it for sorting, atm this seems easier
      scoringWeight,
      colourfamilyCode,
      texturefamilyCode
    };
  });
};
