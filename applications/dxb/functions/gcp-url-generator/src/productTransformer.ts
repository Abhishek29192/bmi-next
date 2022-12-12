import type { Product as PimProduct } from "@bmi/pim-types";
import { generateHashFromString, generateUrl, isDefined } from "@bmi/utils";
import {
  Classification as PimClassification,
  Feature
} from "@bmi/pim-types/src";
import { GeneratedObjectWithUrl } from "./types";

export const transformProduct = (
  product: PimProduct
): GeneratedObjectWithUrl[] => {
  if (product.approvalStatus !== "approved" || !product.name) {
    return [];
  }
  return (product.variantOptions || [])
    .map((variant) => {
      if (variant.approvalStatus !== "approved") {
        return undefined;
      }

      const hashedCode = generateHashFromString(variant.code, false);
      const name = product.name!;
      let colour: string | undefined;
      let textureFamily: string | undefined;
      let variantAttribute: string | undefined;
      let materials: string | undefined;
      const mergedClassifications = mergeClassifications(
        product.classifications || [],
        variant.classifications || []
      );
      mergedClassifications.forEach((classification) => {
        classification.features?.forEach((feature) => {
          const featureCode = feature.code.split("/").pop()!;
          // TODO: Remove upercase checks - DXB-3449
          if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.colour".toUpperCase()
          ) {
            colour = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.texturefamily".toUpperCase()
          ) {
            textureFamily = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.variantattribute".toUpperCase()
          ) {
            variantAttribute = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "generalInformation.materials".toUpperCase()
          ) {
            materials = feature.featureValues[0].value;
          }
        });
      });
      const transformedProduct: GeneratedObjectWithUrl = {
        variantCode: variant.code,
        catalog: process.env.PIM_CATALOG_NAME,
        url: `/p/${generateProductUrl(
          name,
          hashedCode,
          colour,
          materials,
          textureFamily,
          variantAttribute
        )}`
      };
      return transformedProduct;
    })
    .filter(isDefined);
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

const mergeClassifications = (
  productClassifications: readonly PimClassification[],
  variantClassifications: readonly PimClassification[]
): PimClassification[] => {
  const productClassificationMap = new Map(
    productClassifications.map((classification) => [
      classification.code,
      classification
    ])
  );

  const variantClassificationsMap = new Map(
    variantClassifications.map((classification) => [
      classification.code,
      classification
    ])
  );

  // take all COMMON classifications and Variant ONLY classifications
  // merge their features in such that base features
  // are overwritten by variant features of same classifications
  const mergedClassifications: Map<string, PimClassification> = new Map(
    [...variantClassificationsMap.entries()].map(
      ([key, variantClassification]) => {
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

        // only set the product features which do not exist in variant features!
        productFeaturesMap.forEach((productFeature, key) => {
          if (mergedFeaturesMap.get(key) === undefined) {
            mergedFeaturesMap.set(key, productFeature);
          }
        });
        variantClassification.features = Array.from(mergedFeaturesMap.values());
        return [key, variantClassification];
      }
    )
  );

  // process remaining classifications that exists ONLY in base/product
  // add them to collection at the end
  productClassificationMap.forEach((classification, key) => {
    if (variantClassificationsMap.get(key) === undefined) {
      mergedClassifications.set(key, classification);
    }
  });

  return [...mergedClassifications.values()];
};
