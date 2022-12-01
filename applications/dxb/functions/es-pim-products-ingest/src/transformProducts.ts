/* eslint-disable security/detect-object-injection */
import logger from "@bmi-digital/functions-logger";
import type {
  Product as ESProduct,
  ProductReference as ESProductReference
} from "@bmi/elasticsearch-types";
import {
  BaseProduct,
  Classification,
  Feature,
  Product as PIMProduct,
  VariantOption as PIMVariant,
  ProductReference as PIMProductReference
} from "@bmi/pim-types";
import { generateHashFromString, generateUrl, isDefined } from "@bmi/utils";
import {
  ESIndexObject,
  findMainImage,
  findProductBrandLogoCode,
  generateSubtitleValues,
  getSizeLabel,
  IndexedItemGroup,
  indexFeatures,
  mapProductClassifications,
  TransformedMeasurementValue
} from "./CLONE";
import { getCategoryFilters } from "./utils/filterHelpers";

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
  const variantClassificationsMap = new Map(
    (variant.classifications || [])
      .filter(({ code }) => code !== "scoringWeightAttributes")
      .map((classification) => [classification.code, classification])
  );
  logger.info({
    message: `variant classifications except "scoringWeightAttributes": ${variantClassificationsMap}`
  });
  // take all COMMON classifications and Variant ONLY classifications
  // merge their features in such that base features
  // are overwritten by variant features of same classifications
  variantClassificationsMap.forEach((variantClassification, key) => {
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
    if (variantClassificationsMap.get(key) === undefined) {
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

export const transformProduct = (product: PIMProduct): ESProduct[] => {
  if (!product.name) {
    return [];
  }

  const mappedClassifications = mapProductClassifications(
    product,
    PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
  );

  const allCategoriesAsProps: IndexedItemGroup<ESIndexObject> =
    getCategoryFilters(product.categories || []);

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
      "summary",
      "description",
      "longDescription",
      "shortDescription",
      "productBenefits",
      "visualiserAssets"
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

    const name = product.name!;

    const esProduct: ESProduct = {
      ...indexedFeatures,
      ...allCategoriesAsProps,
      ...baseAttributes,
      name,
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
        name,
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
  bimAttributes = "bimAttributes",
  fabDisProductInformation = "fabDisProductInformation",
  fabDisPricingInformation = "fabDisPricingInformation",
  fabDisOrderInformation = "fabDisOrderInformation",
  fabDisSupplierAndDistributorInformation = "fabDisSupplierAndDistributorInformation",
  fabDisCategoryInformation = "fabDisCategoryInformation",
  fabDisPackagingInformation = "fabDisPackagingInformation",
  fabDisAssetInformation = "fabDisAssetInformation"
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
  productPageURL = "productPageURL",
  MANUFACTURER = "MANUFACTURER",
  IDENTIFIER30 = "IDENTIFIER30",
  IDENTIFIER240 = "IDENTIFIER240",
  DOUANE = "DOUANE",
  SECT = "SECT",
  SECTU = "SECTU",
  MADE = "MADE",
  DATETARIF = "DATETARIF",
  TARIFD = "TARIFD",
  QMC = "QMC",
  MUL = "MUL",
  UB = "UB",
  QMVT = "QMVT",
  ST = "ST",
  DELAY = "DELAY",
  DATESTA = "DATESTA",
  DLSR = "DLSR",
  EDI = "EDI",
  REFANT = "REFANT",
  DATEREC = "DATEREC",
  REFE = "REFE",
  REFNEW = "REFNEW",
  REFOLD = "REFOLD",
  MKT1 = "MKT1",
  MKT1L = "MKT1L",
  MKT2 = "MKT2",
  MKT2L = "MKT2L",
  MKT3 = "MKT3",
  MKT3L = "MKT3L",
  MKT4 = "MKT4",
  MKT4L = "MKT4L",
  MKT5 = "MKT5",
  MKT5L = "MKT5L",
  FAM1 = "FAM1",
  FAM1L = "FAM1L",
  FAM2 = "FAM2",
  FAM2L = "FAM2L",
  FAM3 = "FAM3",
  FAM3L = "FAM3L",
  QCT = "QCT",
  GTIN14 = "GTIN14",
  HAUT = "HAUT",
  HAUTU = "HAUTU",
  LARG = "LARG",
  LARGU = "LARGU",
  PROF = "PROF",
  PROFU = "PROFU",
  POIDS = "POIDS",
  POIDSU = "POIDSU",
  VOL = "VOL",
  VOLU = "VOLU",
  CONSI = "CONSI",
  STACK = "STACK",
  CODVAL = "CODVAL",
  NUM = "NUM",
  URL = "URL",
  URLT = "URLT",
  RTYP = "RTYP",
  RNUM = "RNUM",
  RNAT = "RNAT",
  RCOD = "RCOD",
  RNBR = "RNBR",
  RTEXTE = "RTEXTE",
  RDATE = "RDATE",
  RVAL = "RVAL",
  RVU = "RVU",
  RNOM = "RNOM",
  RURL = "RURL",
  RURLT = "RURLT"
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
  [TwoOneClassToIgnore.bimAttributes]: [TwoOneAttribToIgnore.productPageURL],
  [TwoOneClassToIgnore.fabDisAssetInformation]: [
    TwoOneAttribToIgnore.MANUFACTURER,
    TwoOneAttribToIgnore.IDENTIFIER30,
    TwoOneAttribToIgnore.IDENTIFIER240,
    TwoOneAttribToIgnore.DOUANE,
    TwoOneAttribToIgnore.SECT,
    TwoOneAttribToIgnore.SECTU,
    TwoOneAttribToIgnore.MADE
  ],
  [TwoOneClassToIgnore.fabDisPricingInformation]: [
    TwoOneAttribToIgnore.DATETARIF,
    TwoOneAttribToIgnore.TARIFD,
    TwoOneAttribToIgnore.QMC,
    TwoOneAttribToIgnore.MUL
  ],
  [TwoOneClassToIgnore.fabDisOrderInformation]: [
    TwoOneAttribToIgnore.UB,
    TwoOneAttribToIgnore.QMC,
    TwoOneAttribToIgnore.MUL,
    TwoOneAttribToIgnore.QMVT,
    TwoOneAttribToIgnore.ST,
    TwoOneAttribToIgnore.DELAY,
    TwoOneAttribToIgnore.DATESTA,
    TwoOneAttribToIgnore.DLSR
  ],
  [TwoOneClassToIgnore.fabDisSupplierAndDistributorInformation]: [
    TwoOneAttribToIgnore.EDI,
    TwoOneAttribToIgnore.REFANT,
    TwoOneAttribToIgnore.DATEREC,
    TwoOneAttribToIgnore.REFE,
    TwoOneAttribToIgnore.REFNEW,
    TwoOneAttribToIgnore.REFOLD
  ],
  [TwoOneClassToIgnore.fabDisCategoryInformation]: [
    TwoOneAttribToIgnore.MKT1,
    TwoOneAttribToIgnore.MKT1L,
    TwoOneAttribToIgnore.MKT2,
    TwoOneAttribToIgnore.MKT2L,
    TwoOneAttribToIgnore.MKT3,
    TwoOneAttribToIgnore.MKT3L,
    TwoOneAttribToIgnore.MKT4,
    TwoOneAttribToIgnore.MKT4L,
    TwoOneAttribToIgnore.MKT5,
    TwoOneAttribToIgnore.MKT5L,
    TwoOneAttribToIgnore.FAM1,
    TwoOneAttribToIgnore.FAM1L,
    TwoOneAttribToIgnore.FAM2,
    TwoOneAttribToIgnore.FAM2L,
    TwoOneAttribToIgnore.FAM3,
    TwoOneAttribToIgnore.FAM3L
  ],
  [TwoOneClassToIgnore.fabDisPackagingInformation]: [
    TwoOneAttribToIgnore.QCT,
    TwoOneAttribToIgnore.GTIN14,
    TwoOneAttribToIgnore.HAUT,
    TwoOneAttribToIgnore.HAUTU,
    TwoOneAttribToIgnore.LARG,
    TwoOneAttribToIgnore.LARGU,
    TwoOneAttribToIgnore.PROF,
    TwoOneAttribToIgnore.PROFU,
    TwoOneAttribToIgnore.POIDS,
    TwoOneAttribToIgnore.POIDSU,
    TwoOneAttribToIgnore.VOL,
    TwoOneAttribToIgnore.VOLU,
    TwoOneAttribToIgnore.CONSI,
    TwoOneAttribToIgnore.STACK
  ],
  [TwoOneClassToIgnore.fabDisAssetInformation]: [
    TwoOneAttribToIgnore.CODVAL,
    TwoOneAttribToIgnore.NUM,
    TwoOneAttribToIgnore.URL,
    TwoOneAttribToIgnore.URLT,
    TwoOneAttribToIgnore.RTYP,
    TwoOneAttribToIgnore.RNUM,
    TwoOneAttribToIgnore.RNAT,
    TwoOneAttribToIgnore.RCOD,
    TwoOneAttribToIgnore.RNBR,
    TwoOneAttribToIgnore.RTEXTE,
    TwoOneAttribToIgnore.RDATE,
    TwoOneAttribToIgnore.RVAL,
    TwoOneAttribToIgnore.RVU,
    TwoOneAttribToIgnore.RNOM,
    TwoOneAttribToIgnore.RURL,
    TwoOneAttribToIgnore.RURLT
  ]
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

const combineProductReferences = (
  product: PIMProduct,
  variant: PIMVariant
): ESProductReference[] | undefined => {
  const mappedBaseProductReferences = transformProductReferences(
    product.productReferences
  );

  const mappedVariantReferences = transformProductReferences(
    variant.productReferences
  );

  if (!mappedBaseProductReferences?.length) {
    return mappedVariantReferences;
  }

  if (!mappedVariantReferences?.length) {
    return mappedBaseProductReferences;
  }

  //combines productReferences of the base product and variant.
  // If the variant and base product has productReferences of the same type, the productReference of the base product will be ignored
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

const transformProductReferences = (
  productReferences?: PIMProductReference[]
): ESProductReference[] | undefined => {
  if (!productReferences?.length) {
    return undefined;
  }

  return productReferences.map((productReference) => ({
    type: productReference.referenceType,
    code: productReference.target.code,
    name: productReference.target.name
  }));
};
