/* eslint-disable security/detect-object-injection */
import {
  Category,
  Classification,
  Feature,
  Product as PIMProduct,
  VariantOption as PIMVariant,
  BaseProduct,
  TwoOneIgnoreDictionary
} from "@bmi/pim-types";
import type { ProductVariant as ESProduct } from "./es-model";
import {
  findProductBrandLogoCode,
  getSizeLabel,
  mapProductClassifications,
  TransformedMeasurementValue,
  indexFeatures,
  IndexedItemGroup,
  groupBy,
  ESIndexObject,
  extractFeatureCode
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

const filterTwoOneAttributes = (
  classificationCode: string,
  origFeatures: Feature[]
) => {
  const excludeAttributes = TwoOneIgnoreDictionary[classificationCode];
  return origFeatures.filter((feature) => {
    const featureCode = extractFeatureCode(
      PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
      feature.code
    );
    const attributeName = featureCode
      .replace(`${classificationCode}.`, "")
      .toLowerCase();
    if (
      excludeAttributes &&
      excludeAttributes.some(
        (attribute) => attribute.toLowerCase() === attributeName
      )
    ) {
      return false;
    }
    return true;
  });
};

// Combines all the classification representing a variant, which includes the classifications from base product, which are overwritten by variant ones.
const combineVariantClassifications = (
  product: PIMProduct,
  variant: PIMVariant
): Classification[] => {
  const mergedClassifications: Map<string, Classification> = new Map();

  const productClassificationMap = new Map(
    (product.classifications || []).map((classification) => [
      classification.code,
      classification
    ])
  );

  // process variant classifications except "scoringWeightAttributes"
  const vairantClassificationsMap = new Map(
    (variant.classifications || [])
      .filter(({ code }) => code !== "scoringWeightAttributes")
      .map((classification) => [classification.code, classification])
  );

  // take all COMMON classifications and Variant ONLY classifications
  // merge their features in such that base features
  // are overwritten by variant features of same classifications
  vairantClassificationsMap.forEach((variantClassification, key) => {
    const mergedFeaturesMap: Map<string, Feature> = new Map(
      (variantClassification.features || []).map((feature) => [
        feature.code,
        feature
      ])
    );

    const productFeaturesMap = new Map(
      (productClassificationMap.get(key)?.features || []).map((feature) => [
        feature.code,
        feature
      ])
    );
    //only set the product features which do not exist in variant features!
    productFeaturesMap.forEach((productFeature, key) => {
      if (mergedFeaturesMap.get(key) === undefined) {
        mergedFeaturesMap.set(key, productFeature);
      }
    });
    variantClassification.features = filterTwoOneAttributes(
      variantClassification.code,
      Array.from(mergedFeaturesMap.values())
    );
    mergedClassifications.set(key, variantClassification);
  });

  // process remaining classifications that exists ONLY in base/product
  // add them to collection at the end
  productClassificationMap.forEach((classification, key) => {
    if (vairantClassificationsMap.get(key) === undefined) {
      const origFeatures = classification.features || [];
      classification.features = filterTwoOneAttributes(
        classification.code,
        origFeatures
      );
      mergedClassifications.set(key, classification);
    }
  });

  return Array.from(mergedClassifications.values());
};

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used inside the nested map later on
  const mappedClassifications = mapProductClassifications(
    product,
    PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
  );

  const categoryGroups: IndexedItemGroup<Category> = groupBy(
    product.categories,
    "categoryType"
  );
  const groupsByParentCategoryCodes: IndexedItemGroup<Category> = groupBy(
    product.categories,
    "parentCategoryCode"
  );

  const allGroupsOfCategories = {
    ...categoryGroups,
    ...groupsByParentCategoryCodes
  };
  const allCategoriesAsProps: IndexedItemGroup<ESIndexObject> = Object.keys(
    allGroupsOfCategories
  )
    .filter((key) => key.length > 0 && key !== "undefined")
    .reduce((categoryAsProps, catName) => {
      // eslint-disable-next-line security/detect-object-injection
      const nameAndCodeValues = allGroupsOfCategories[catName].map((cat) => {
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

  return (product.variantOptions || []).map((variant) => {
    const combinedClassifications = combineVariantClassifications(
      product,
      variant
    );

    const indexedFeatures = indexFeatures(
      PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
      combinedClassifications
    );

    // combined classifications does not override 'vairant' 'scoringWeightAttributes'
    // hence this is 'product' `scoringWeightAttributes` classification
    const scoringWeight =
      combinedClassifications.find(
        ({ code }) => code === "scoringWeightAttributes"
      )?.features?.[0]?.featureValues?.[0]?.value || "0";

    const variantScoringWeight =
      (variant.classifications || []).find(
        ({ code }) => code === "scoringWeightAttributes"
      )?.features?.[0]?.featureValues?.[0]?.value || "0";

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

    let measurementValue: string | undefined;

    const measurementsClassification =
      mappedClassifications[variant.code]?.measurements;
    if (measurementsClassification) {
      measurementValue = getSizeLabel(
        measurementsClassification as TransformedMeasurementValue
      );
    }

    const baseProduct: BaseProduct = {
      code: product.code,
      name: product.name
    };

    const productVariant: ESProduct = {
      ...indexedFeatures,
      ...allCategoriesAsProps,
      ...baseAttributes,
      code: variant.code,
      baseProduct: { ...baseProduct },
      brandCode: findProductBrandLogoCode(product),
      // TODO: Perhaps we're only interested in specific images?
      images: [...(variant.images || []), ...(product.images || [])],
      // All cats, PLP could be by any type of cat, Brand and ProductFamily cats here are important
      allCategories: product.categories || [],
      classifications: combinedClassifications,
      measurementValue,
      productScoringWeightInt:
        scoringWeight && Number.isFinite(Number.parseInt(scoringWeight))
          ? Number.parseInt(scoringWeight)
          : 0,
      variantScoringWeightInt:
        variantScoringWeight &&
        Number.isFinite(Number.parseInt(variantScoringWeight))
          ? Number.parseInt(variantScoringWeight)
          : 0,
      totalVariantCount: product.variantOptions.length
    };
    return productVariant;
  });
};
