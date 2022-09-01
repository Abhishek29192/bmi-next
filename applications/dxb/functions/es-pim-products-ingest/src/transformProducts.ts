/* eslint-disable security/detect-object-injection */
import logger from "@bmi-digital/functions-logger";
import type {
  Product as ESProduct,
  ProductReference as ESProductReference
} from "@bmi/elasticsearch-types";
import {
  BaseProduct,
  Category,
  Classification,
  Feature,
  Product as PIMProduct,
  ProductReference as PIMProductReference,
  VariantOption as PIMVariant
} from "@bmi/pim-types";
import { generateHashFromString, generateUrl, isDefined } from "@bmi/utils";
import {
  ESIndexObject,
  findMainImage,
  findProductBrandLogoCode,
  generateSubtitleValues,
  getSizeLabel,
  groupBy,
  IndexedItemGroup,
  indexFeatures,
  mapProductClassifications,
  TransformedMeasurementValue
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
  const mergedClassifications: Map<string, Classification> = new Map();

  const productClassificationMap = new Map(
    (product.classifications || []).map((classification) => [
      classification.code,
      classification
    ])
  );
  logger.info({
    message: `product classification: ${productClassificationMap}`
  });
  // process variant classifications except "scoringWeightAttributes"
  const vairantClassificationsMap = new Map(
    (variant.classifications || [])
      .filter(({ code }) => code !== "scoringWeightAttributes")
      .map((classification) => [classification.code, classification])
  );
  logger.info({
    message: `variant classifications except "scoringWeightAttributes": ${vairantClassificationsMap}`
  });
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
      PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
      variantClassification.code,
      Array.from(mergedFeaturesMap.values())
    );
    mergedClassifications.set(key, variantClassification);
    logger.info({
      message: `mergedClassifications common and variant classification: ${mergedClassifications}`
    });
  });

  // process remaining classifications that exists ONLY in base/product
  // add them to collection at the end
  productClassificationMap.forEach((classification, key) => {
    if (vairantClassificationsMap.get(key) === undefined) {
      logger.info({
        message: `classifications that exists ONLY in base/product: ${classification}`
      });
      const origFeatures = classification.features || [];
      classification.features = filterTwoOneAttributes(
        PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
        classification.code,
        origFeatures
      );
      mergedClassifications.set(key, classification);
    }
  });
  logger.info({
    message: `mergedClassifications with base product classification: ${Array.from(
      mergedClassifications.values()
    )}`
  });
  return Array.from(mergedClassifications.values());
};

const combineProductReferences = (
  product: PIMProduct,
  variant: PIMVariant
): ESProductReference[] => {
  const mappedBaseProductReferences = transformProductReferences(
    product.productReferences
  );
  if (!variant.productReferences?.length) {
    return mappedBaseProductReferences;
  }

  const mappedVariantReferences = transformProductReferences(
    variant.productReferences
  );

  return mappedBaseProductReferences.reduce((prev, current) => {
    const existsForVariant = prev.find(
      (productReference) => productReference.type === current.type
    );

    if (existsForVariant) {
      return prev;
    }

    return [...prev, current];
  }, mappedVariantReferences);
};

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  const mappedClassifications = mapProductClassifications(
    product,
    PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
  );

  const categoryGroups: IndexedItemGroup<Category> = groupBy(
    product.categories || [],
    "categoryType"
  );
  const groupsByParentCategoryCodes: IndexedItemGroup<Category> = groupBy(
    product.categories || [],
    "parentCategoryCode"
  );

  const allGroupsOfCategories = {
    ...categoryGroups,
    ...groupsByParentCategoryCodes
  };

  logger.info({
    message: `allGroupsOfCategories: ${allGroupsOfCategories}`
  });

  //TODO: DXB-3449 - remove `toUpperCase` when case agnostic to be reverted!
  const allCategoriesAsProps: IndexedItemGroup<ESIndexObject> = Object.keys(
    allGroupsOfCategories
  )
    .filter((key) => key.length > 0 && key !== "undefined")
    .reduce((categoryAsProps, catName) => {
      const origialCatName = catName;
      const catNameCapitalised = catName.toUpperCase();
      // eslint-disable-next-line security/detect-object-injection
      const nameAndCodeValues = allGroupsOfCategories[origialCatName].map(
        (cat) => {
          return {
            code: cat.code,
            name: cat.name
          };
        }
      );
      return {
        ...categoryAsProps,
        [catNameCapitalised]: nameAndCodeValues
      };
    }, {});

  logger.info({
    message: `allCategoriesAsProps: ${allCategoriesAsProps}`
  });
  return (product.variantOptions || []).map((variant) => {
    const combinedClassifications = combineVariantClassifications(
      product,
      variant
    );
    logger.info({
      message: `combinedClassifications: ${combinedClassifications}`
    });
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

    let measurementValue: string;

    const measurementsClassification =
      mappedClassifications[variant.code]?.measurements;
    if (measurementsClassification) {
      measurementValue = getSizeLabel(
        measurementsClassification as TransformedMeasurementValue
      );
    } else {
      measurementValue = "";
    }
    logger.info({
      message: `measurementsClassification: ${measurementsClassification}`
    });
    const colorTextureSubtitle: string = generateSubtitleValues(
      combinedClassifications
    );
    const subTitle: string =
      colorTextureSubtitle.length === 0
        ? measurementValue
        : colorTextureSubtitle;

    const baseProduct: BaseProduct = {
      code: product.code,
      name: product.name
    };

    const esProduct: ESProduct = {
      ...indexedFeatures,
      ...allCategoriesAsProps,
      ...baseAttributes,
      externalProductCode: baseAttributes.externalProductCode || "",
      isSampleOrderAllowed: baseAttributes.isSampleOrderAllowed || false,
      code: variant.code,
      baseProduct: { ...baseProduct },
      brandCode: findProductBrandLogoCode(product),
      // TODO: Perhaps we're only interested in specific images?
      images: [...(variant.images || []), ...(product.images || [])],
      // All cats, PLP could be by any type of cat, Brand and ProductFamily cats here are important
      allCategories: product.categories
        ? product.categories.map((cat) => ({
            code: cat.code,
            parentCategoryCode: cat.parentCategoryCode || ""
          }))
        : [],
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
      totalVariantCount: product.variantOptions!.length,
      mainImage: findMainImage([
        ...(variant.images || []),
        ...(product.images || [])
      ]),
      productReferences: combineProductReferences(product, variant),
      path: `/p/${generateProductUrl(
        baseAttributes.name,
        generateHashFromString(variant.code, false),
        combinedClassifications
          .find(
            (classification) => classification.code === "appearanceAttributes"
          )
          ?.features?.find(
            (feature) =>
              //TODO: DXB-3449 - remove `toUpperCase` when case agnostic to be reverted!
              feature.code.split("/").pop()!.toUpperCase() ===
              "appearanceAttributes.colour".toUpperCase()
          )?.featureValues[0].value,
        combinedClassifications
          .find(
            (classification) => classification.code === "generalInformation"
          )
          ?.features?.find(
            (feature) =>
              //TODO: DXB-3449 - remove `toUpperCase` when case agnostic to be reverted!
              feature.code.split("/").pop()!.toUpperCase() ===
              "generalInformation.materials".toUpperCase()
          )?.featureValues[0].value,
        combinedClassifications
          .find(
            (classification) => classification.code === "appearanceAttributes"
          )
          ?.features?.find(
            (feature) =>
              //TODO: DXB-3449 - remove `toUpperCase` when case agnostic to be reverted!
              feature.code.split("/").pop()!.toUpperCase() ===
              "appearanceAttributes.texturefamily".toUpperCase()
          )?.featureValues[0].value,
        combinedClassifications
          .find(
            (classification) => classification.code === "appearanceAttributes"
          )
          ?.features?.find(
            (feature) =>
              //TODO: DXB-3449 - remove `toUpperCase` when case agnostic to be reverted!
              feature.code.split("/").pop()!.toUpperCase() ===
              "appearanceAttributes.variantattribute".toUpperCase()
          )?.featureValues[0].value
      )}`,
      subTitle
    };
    logger.info({
      message: `esProduct: ${esProduct}`
    });
    return esProduct;
  });
};

const generateProductUrl = (
  name: string,
  hashedCode: string,
  colour?: string,
  materials?: string,
  textureFamily?: string,
  variantAttribute?: string
): string => {
  // this is currently feature flagged so that countries can opt-in for 'variant attributes'
  if (
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL === "true" &&
    variantAttribute
  ) {
    return generateUrl([name, variantAttribute, hashedCode]);
  }

  return generateUrl(
    [name, colour, textureFamily, materials, hashedCode].filter(isDefined)
  );
};

export enum TwoOneClassToIgnore {
  bagUomAttributes = "bagUomAttributes",
  canisterUomAttributes = "canisterUomAttributes",
  cartonUomAttributes = "cartonUomAttributes",
  crateUomAttributes = "crateUomAttributes",
  cubicMeterUomAttributes = "cubicMeterUomAttributes",
  drumUomAttributes = "drumUomAttributes",
  eachUomAttributes = "eachUomAttributes",
  kilogramUomAttributes = "kilogramUomAttributes",
  kilometerUomAttributes = "kilometerUomAttributes",
  kilowattUomAttributes = "kilowattUomAttributes",
  literUomAttributes = "literUomAttributes",
  meterUomAttributes = "meterUomAttributes",
  packUomAttributes = "packUomAttributes",
  palletUomAttributes = "palletUomAttributes",
  pieceUomAttributes = "pieceUomAttributes",
  rollsUomAttributes = "rollsUomAttributes",
  squareMeterUomAttributes = "squareMeterUomAttributes",
  bimAttributes = "bimAttributes"
}

export enum TwoOneAttribToIgnore {
  categoryOfEan11 = "categoryOfEan11",
  denominatorForConversion = "denominatorForConversion",
  ean11 = "ean11",
  grossWeight = "grossWeight",
  height = "height",
  length = "length",
  numeratorForConversion = "numeratorForConversion",
  volume = "volume",
  width = "width",
  unit = "unit",
  uomType = "uomType",
  productPageURL = "productPageURL"
}

export const commonIgnoreList = [
  TwoOneAttribToIgnore.categoryOfEan11,
  TwoOneAttribToIgnore.denominatorForConversion,
  TwoOneAttribToIgnore.ean11,
  TwoOneAttribToIgnore.grossWeight,
  TwoOneAttribToIgnore.height,
  TwoOneAttribToIgnore.length,
  TwoOneAttribToIgnore.numeratorForConversion,
  TwoOneAttribToIgnore.unit,
  TwoOneAttribToIgnore.uomType,
  TwoOneAttribToIgnore.volume,
  TwoOneAttribToIgnore.width
];

type TwoOneClassificationAttributeDictionary = {
  [classKey: string]: TwoOneAttribToIgnore[];
};

export const TwoOneIgnoreDictionary: TwoOneClassificationAttributeDictionary = {
  [TwoOneClassToIgnore.bagUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.canisterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.crateUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.cubicMeterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.eachUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilogramUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilometerUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilowattUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.literUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.meterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.packUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.palletUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.pieceUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.rollsUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.squareMeterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.drumUomAttributes]: [
    TwoOneAttribToIgnore.unit,
    TwoOneAttribToIgnore.uomType
  ],
  [TwoOneClassToIgnore.cartonUomAttributes]: [
    TwoOneAttribToIgnore.unit,
    TwoOneAttribToIgnore.uomType
  ],
  [TwoOneClassToIgnore.bimAttributes]: [TwoOneAttribToIgnore.productPageURL]
};

const extractFeatureCode = (
  pimClassificationNameSpace: string,
  code: string
) => {
  return code.replace(`${pimClassificationNameSpace}/`, "");
};

const filterTwoOneAttributes = (
  pimClassificationCatalogueNamespace: string,
  classificationCode: string,
  origFeatures: Feature[]
) => {
  // eslint-disable-next-line security/detect-object-injection
  const excludeAttributes = TwoOneIgnoreDictionary[classificationCode];
  return origFeatures.filter((feature) => {
    const featureCode = extractFeatureCode(
      pimClassificationCatalogueNamespace,
      feature.code
    );
    // TODO: Remove lower caseing as part of DXB-3449
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

const transformProductReferences = (
  productReferences?: PIMProductReference[]
): ESProductReference[] => {
  if (!productReferences?.length) {
    return [];
  }

  return productReferences.map((productReference) => ({
    type: productReference.referenceType,
    code: productReference.target.code,
    name: productReference.target.name
  }));
};
