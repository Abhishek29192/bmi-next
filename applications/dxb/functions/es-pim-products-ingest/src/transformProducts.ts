/* eslint-disable security/detect-object-injection */
import {
  Category,
  Classification,
  Product as PIMProduct,
  VariantOption as PIMVariant
} from "./pim";
import type { ProductVariant as ESProduct } from "./es-model";
import {
  findProductBrandLogoCode,
  getFullCategoriesPaths,
  getGroupCategory,
  getLeafCategory,
  getSizeLabel,
  mapProductClassifications,
  TransformedMeasurementValue,
  IndexFeatures,
  IndexedItemGroup,
  groupBy,
  ESIndexObject
} from "./CLONE";

// Can't use lodash pick as it's not type-safe
const pick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  const ret = {} as Pick<T, K>;
  keys.forEach((key) => (ret[key] = obj[key]));
  return ret;
};

const {
  // TODO: Remove this fallback once the environment variable is correctly set.
  PIM_CLASSIFICATION_CATALOGUE_NAMESPACE = "bmiClassificationCatalog/1.0"
} = process.env;

// Combines all the classification representing a variant, which includes the classifications from base product, which are overwritten by variant ones.
const combineVariantClassifications = (
  product: PIMProduct,
  variant: PIMVariant
): Classification[] => {
  const baseClassifications = product.classifications || [];
  // scoringWeightAttributes is special in that we ignore it in variants
  // it may or may not appear in base, but variant's is ignored
  const variantClassifications = (variant.classifications || []).filter(
    ({ code }) => code !== "scoringWeightAttributes"
  );

  const allClassificationsMap = new Map(
    [...baseClassifications, ...variantClassifications].map(
      (classification) => [classification.code, classification]
    )
  );

  return Array.from(allClassificationsMap.values());
};

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  const mappedClassifications = mapProductClassifications(
    product,
    PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
  );

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

  const categoryGroups: IndexedItemGroup<Category> = groupBy(
    product.categories,
    "categoryType"
  );

  const allCategoriesAsProps: IndexedItemGroup<ESIndexObject> = Object.keys(
    categoryGroups
  ).reduce((categoryAsProps, catName) => {
    // eslint-disable-next-line security/detect-object-injection
    const nameAndCodeValues = categoryGroups[catName].map((cat) => {
      return {
        code: cat.code,
        name: cat.name
      };
    });
    return {
      ...categoryAsProps,
      [catName]: nameAndCodeValues
    };
  }, {});

  //category codes ONLY
  // not sure if we need to index array of category codes of special category type 'Category'
  // was in the spike.. need to ask Ben
  const categoryCodesOnly = (categoryGroups["Category"] || []).map((cat) => {
    return cat.code;
  });

  return (product.variantOptions || []).map((variant) => {
    const classifications = combineVariantClassifications(product, variant);

    let indexedFeatures = IndexFeatures(
      PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
      classifications
    );

    const allfeatureCodes: string[] = Object.keys(indexedFeatures);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const generalInformationClassification = classifications.find(
      ({ code }) => code === "generalInformation"
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const colourfamilyAppearance = (
        appearanceClassifications.features || []
      ).find(
        ({ code }) =>
          code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`
      )?.featureValues?.[0];

      colourfamilyCode = colourfamilyAppearance?.code;
      colourfamilyValue = colourfamilyAppearance?.value;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    if (generalInformationClassification) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const materialsGeneralInformation = (
        generalInformationClassification.features || []
      ).find(
        ({ code }) =>
          code ===
          `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`
      )?.featureValues?.[0];

      materialsCode = materialsGeneralInformation?.code;
      materialsValue = materialsGeneralInformation?.value;
    }

    const measurementsClassification =
      mappedClassifications[variant.code]?.measurements;
    if (measurementsClassification) {
      measurementValue = getSizeLabel(
        measurementsClassification as TransformedMeasurementValue
      );
    }

    return {
      ...indexedFeatures,
      ...allCategoriesAsProps,
      "category.codes": categoryCodesOnly,
      "feature.codes": allfeatureCodes,
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
      scoringWeightInt:
        scoringWeight && Number.isFinite(Number.parseInt(scoringWeight))
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
