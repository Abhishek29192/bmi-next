// THIS IS A CLONE OF EXTERNAL DEPENDENCIES I COULDN'T REQUIRE FROM HEAD ATM
// POSSIBLY WITH SOME CHANGES

import _ from "lodash";
import { Product } from "./types/pim";

export type Category = {
  parentCategoryCode: string;
  name: string;
  categoryType: string;
  code: string;
};

type CategoryPath = readonly Category[];

export type ProductCategoryTree = {
  [category: string]: {
    name: string;
    values: Category[];
  };
};

export const findUniqueClassificationsOnVariant = (
  baseClassifications: TransformedClassificationsMap,
  variantClassifications: TransformedClassificationsMap
): TransformedClassificationsMap => {
  return _.pickBy(variantClassifications, (value, key) => {
    return !(key in baseClassifications);
  });
};

export const findProductBrandLogoCode = (product: Product) => {
  return _.result<string>(
    _.find(product.categories, {
      parentCategoryCode: "BMI_Brands"
    }),
    "code"
  );
};

// NOTE: Figuring out the category paths is kind of naive.
// I believe it works with the assumptions that PIM are working with
// But it would make more sense if we analysed this data more accurately, to be sure.
export const getFullCategoriesPaths = (
  categories: readonly Category[]
): CategoryPath[] => {
  // Find only "Category" categories
  // Also assign a "found" prop so each can only be selected once
  const categoriesArray: (Category & { found: boolean })[] = categories
    .filter(({ categoryType }) => categoryType === "Category")
    .map((category) => ({
      ...category,
      found: false
    }));

  // Find all the roots
  const roots = categoriesArray.filter(
    ({ parentCategoryCode }) => parentCategoryCode === ""
  );

  // Then iterate over the roots and get all the other
  return roots.map((rootCategory) => {
    let path = [rootCategory];
    let currentNode = rootCategory;

    // While we find a node, find another node which is its child, and add to path
    while (currentNode) {
      currentNode = categoriesArray.find(
        ({ found, parentCategoryCode }) =>
          !found && parentCategoryCode === currentNode.code
      );

      if (currentNode) {
        currentNode.found = true;
        path = [...path, currentNode];
      }
    }

    return path;
  });
};

export const getColourThumbnailUrl = (images): string =>
  _.result(
    _.find(images, { format: "Product-Color-Selector-Large-Desktop" }),
    "url"
  );

export type ClassificationFeatureValue = {
  value: string;
  code?: string; // This doesn't exist on some Features... perhaps we can be more specific with the types
};

type TransformedClassificationValue = {
  name: string;
  value: ClassificationFeatureValue | "n/a";
  thumbnailUrl?: string;
};
type TransformedMeasurementValue = {
  [dimensionName: string]: {
    name: string;
    value: {
      value: string;
      unit: string;
    };
  };
};
export type TransformedClassificationsMap = {
  [classificationName: string]:
    | TransformedClassificationValue
    | TransformedMeasurementValue;
};
export type ClassificationsPerProductMap = {
  [productCode: string]: TransformedClassificationsMap;
};

// Second from last leaf category, which denotes top most parent category of a path
export const getGroupCategory = (branch: CategoryPath) =>
  branch[Math.max(0, branch.length - 2)];

export const getLeafCategory = (branch: CategoryPath) =>
  branch[branch.length - 1];

// Find attributes like surface finish, color, etc, from classifications
// TODO: Try to consolidate with the "unique" approach.
export const mapProductClassifications = (
  product: Product,
  classificationNamepace: string
): ClassificationsPerProductMap => {
  const allProducts: {
    [productCode: string]: Product;
  } = {
    [product.code]: product,
    ...(product.variantOptions || []).reduce((variantProducts, variant) => {
      return {
        ...variantProducts,
        [variant.code]: variant
      };
    }, {})
  };

  // Classifications
  const SCORE_WEIGHT = "scoringWeightAttributes";
  const APPEARANCE = "appearanceAttributes";
  const MEASUREMENTS = "measurements";

  const FEATURES = {
    SCORE_WEIGHT: `${classificationNamepace}/scoringWeightAttributes.scoringweight`,
    TEXTURE_FAMILY: `${classificationNamepace}/appearanceAttributes.texturefamily`,
    COLOUR: `${classificationNamepace}/appearanceAttributes.colour`,
    COLOUR_FAMILY: `${classificationNamepace}/appearanceAttributes.colourfamily`,
    LENGTH: `${classificationNamepace}/measurements.length`,
    WIDTH: `${classificationNamepace}/measurements.width`,
    HEIGHT: `${classificationNamepace}/measurements.height`
  };

  return Object.entries(allProducts).reduce((carry, [productCode, product]) => {
    (product.classifications || []).forEach((classification) => {
      const { code, features } = classification;

      const carryProp = (
        propName: string,
        value: TransformedClassificationValue | TransformedMeasurementValue
      ) => {
        carry[productCode] = {
          ...(carry[productCode] || {}),
          [propName]: value
        };
      };

      // merging object
      // combining things just because I don't trust PIM's data to be consistent
      if (code === SCORE_WEIGHT) {
        // But here, don't care, score should only have one value
        // Feature that contains the value
        const valueFeature = features.find(({ code }) => {
          return code === FEATURES.SCORE_WEIGHT;
        });

        carryProp("scoringweight", {
          name: classification.name,
          value: valueFeature ? valueFeature.featureValues[0] : "n/a"
        });
      }

      if (code === APPEARANCE) {
        features.forEach(({ code, name, featureValues }) => {
          if (code === FEATURES.TEXTURE_FAMILY) {
            carryProp("texturefamily", {
              name,
              value: featureValues ? featureValues[0] : "n/a"
            });
          }

          if (code === FEATURES.COLOUR) {
            carryProp("colour", {
              name,
              value: featureValues ? featureValues[0] : "n/a",
              thumbnailUrl: getColourThumbnailUrl(product.images || [])
            });
          }

          if (code === FEATURES.COLOUR_FAMILY) {
            carryProp("colourfamily", {
              name,
              value: featureValues ? featureValues[0] : "n/a",
              thumbnailUrl: getColourThumbnailUrl(product.images || [])
            });
          }
        });
      }

      if (code === MEASUREMENTS) {
        features.forEach(({ code, name, featureValues, featureUnit }) => {
          if (
            [FEATURES.LENGTH, FEATURES.WIDTH, FEATURES.HEIGHT].includes(code)
          ) {
            const productObject = carry[productCode];
            const measurements = productObject
              ? (productObject.measurements as TransformedMeasurementValue)
              : {};

            carry[productCode] = {
              ...productObject,
              measurements: {
                ...measurements,
                [code.split(".").pop()]: {
                  name,
                  value: {
                    value: featureValues ? featureValues[0] : "n/a",
                    unit: featureUnit.symbol
                  }
                }
              }
            };
          }
        });
      }
    });

    return carry;
  }, {});
};
