/* eslint-disable security/detect-object-injection */
import { result, find } from "lodash";
import { Product, Classification, Category } from "./pim";

type CategoryPath = readonly Category[];

export type ProductCategoryTree = {
  [category: string]: {
    name: string;
    values: Category[];
  };
};

export const findProductBrandLogoCode = (product: Product) => {
  return result<string>(
    find(product.categories, {
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
    let currentNode: (Category & { found: boolean }) | undefined = rootCategory;

    // While we find a node, find another node which is its child, and add to path
    while (currentNode) {
      currentNode = categoriesArray.find(
        ({ found, parentCategoryCode }) =>
          !found && parentCategoryCode === currentNode!.code
      );

      if (currentNode) {
        currentNode.found = true;
        path = [...path, currentNode];
      }
    }

    return path;
  });
};

// product-details-page.tsx
export type ClassificationFeatureValue = {
  value: string;
  code?: string; // This doesn't exist on some Features... perhaps we can be more specific with the types
};

type TransformedClassificationValue = {
  name: string;
  value: ClassificationFeatureValue | "n/a";
  thumbnailUrl?: string;
};
export type TransformedMeasurementValue = {
  [dimensionName: string]: {
    name: string;
    value: {
      value: {
        value: string;
      };
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
// from applications/dxb/head/src/utils/product-details-transforms.ts
export const mapProductClassifications = (
  product: Pick<
    Product,
    "code" | "images" | "classifications" | "variantOptions"
  >,
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
  const GENERAL_INFORMATION = "generalInformation";

  const FEATURES = {
    SCORE_WEIGHT: `${classificationNamepace}/${SCORE_WEIGHT}.scoringweight`,
    TEXTURE_FAMILY: `${classificationNamepace}/${APPEARANCE}.texturefamily`,
    COLOUR: `${classificationNamepace}/${APPEARANCE}.colour`,
    COLOUR_FAMILY: `${classificationNamepace}/${APPEARANCE}.colourfamily`,
    LENGTH: `${classificationNamepace}/${MEASUREMENTS}.length`,
    WIDTH: `${classificationNamepace}/${MEASUREMENTS}.width`,
    HEIGHT: `${classificationNamepace}/${MEASUREMENTS}.height`,
    THICKNESS: `${classificationNamepace}/${MEASUREMENTS}.thickness`,
    MATERIALS: `${classificationNamepace}/${GENERAL_INFORMATION}.materials`
  };

  return Object.entries(allProducts).reduce<ClassificationsPerProductMap>(
    (carry, [productCode, product]) => {
      (product.classifications || []).forEach((classification) => {
        const { code, features } = classification;
        if (code === MEASUREMENTS) {
          features?.forEach(({ code, name, featureValues, featureUnit }) => {
            if (
              [
                FEATURES.LENGTH,
                FEATURES.WIDTH,
                FEATURES.HEIGHT,
                FEATURES.THICKNESS
              ].includes(code)
            ) {
              const productObject = carry[productCode];
              const measurements = productObject
                ? (productObject.measurements as TransformedMeasurementValue)
                : {};

              carry[productCode] = {
                ...productObject,
                measurements: {
                  ...measurements,
                  [code.split(".").pop()!]: {
                    name,
                    value: {
                      value: featureValues ? featureValues[0] : "n/a",
                      unit: featureUnit?.symbol
                    }
                  }
                } as TransformedMeasurementValue
              };
            }
          });
        }
      });

      return carry;
    },
    {}
  );
};

// From applications/dxb/head/src/utils/product-details-transforms.ts
export const getSizeLabel = (
  measurement: TransformedMeasurementValue,
  withUnit = true
) => {
  const components = Object.values(measurement || {}).filter(Boolean);
  if (components.length === 0) {
    return "";
  }
  const sameUnit = components.every(
    (value, i, arr) => value.value.unit === arr[0].value.unit
  );
  const unit = withUnit && sameUnit ? components[0].value.unit : "";

  return (
    components
      .map(({ value }) => value.value.value + (!sameUnit ? value.unit : ""))
      // Add extra space if units don't match
      .join(sameUnit ? "x" : " x ") + unit
  );
};

export type ESIndexObject = {
  code: string;
  name: string;
};

export interface IndexedItem<T = any> {
  [key: string]: T;
}

export interface IndexedItemGroup<T> {
  [key: string]: T[];
}

export const groupBy = <T extends IndexedItem>(
  array: readonly T[],
  key: keyof T
): IndexedItemGroup<T> => {
  return (array || []).reduce<IndexedItemGroup<T>>((map, item) => {
    const itemKey = item[key];
    map[itemKey] = map[itemKey] || [];
    map[itemKey].push(item);
    return map;
  }, {});
};

const extractFeatureCode = (
  pimClassificationNameSpace: string,
  code: string
) => {
  return code.replace(`${pimClassificationNameSpace}/`, "");
};

export const IndexFeatures = (
  pimClassificationNameSpace: string = "",
  classifications: Classification[]
): IndexedItemGroup<ESIndexObject> => {
  const allfeaturesAsProps = (classifications || []).reduce(
    (acc, classification) => {
      const classificationFeatureAsProp = (
        classification.features || []
      ).reduce((featureAsProp, feature) => {
        const featureCode = extractFeatureCode(
          pimClassificationNameSpace,
          feature.code
        );
        const nameAndCodeValues = feature.featureValues.map((featVal) => {
          return {
            code: `${featVal.code || featVal.value}${
              feature.featureUnit?.symbol || ""
            }`.trim(),
            name: `${featVal.value} ${feature.featureUnit?.symbol || ""}`.trim()
          };
        });
        return {
          ...featureAsProp,
          [featureCode]: nameAndCodeValues
        };
      }, {});
      return {
        ...acc,
        ...classificationFeatureAsProp
      };
    },
    {}
  );
  return allfeaturesAsProps;
};
