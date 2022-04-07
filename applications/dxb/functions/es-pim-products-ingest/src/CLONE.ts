/* eslint-disable security/detect-object-injection */
import {
  Product,
  Classification,
  Category,
  TwoOneIgnoreDictionary
} from "@bmi/pim-types";

export type ProductCategoryTree = {
  [category: string]: {
    name: string;
    values: Category[];
  };
};

export const findProductBrandLogoCode = (product: Product) =>
  product.categories?.find((category) => category.categoryType === "Brand")
    ?.code;

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

  const MEASUREMENTS = "measurements";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- eslint doesn't pick up that it's being used
  const FEATURES = {
    LENGTH: `${classificationNamepace}/${MEASUREMENTS}.length`,
    WIDTH: `${classificationNamepace}/${MEASUREMENTS}.width`,
    HEIGHT: `${classificationNamepace}/${MEASUREMENTS}.height`,
    THICKNESS: `${classificationNamepace}/${MEASUREMENTS}.thickness`
  };

  return Object.entries(allProducts).reduce<ClassificationsPerProductMap>(
    (carry, [productCode, product]) => {
      (product.classifications || []).forEach((classification) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- eslint doesn't pick up that it's being used
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
  const components = Object.values(measurement).filter(Boolean);
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

export const extractFeatureCode = (
  pimClassificationNameSpace: string,
  code: string
) => {
  return code.replace(`${pimClassificationNameSpace}/`, "");
};

export const indexFeatures = (
  pimClassificationNameSpace = "",
  classifications: Classification[]
): IndexedItemGroup<ESIndexObject> => {
  const allfeaturesAsProps = classifications.reduce((acc, classification) => {
    const classificationFeatureAsProp = (classification.features || []).reduce(
      (featureAsProp, feature) => {
        const featureCode = extractFeatureCode(
          pimClassificationNameSpace,
          feature.code
        );
        const attributeName = featureCode
          .replace(`${classification.code}.`, "")
          .toLowerCase();
        const excludeAttributes = TwoOneIgnoreDictionary[classification.code];
        if (
          excludeAttributes &&
          excludeAttributes.some(
            (attribName) => attribName.toLowerCase() === attributeName
          )
        ) {
          return {
            ...featureAsProp
          };
        }

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
      },
      {}
    );
    return {
      ...acc,
      ...classificationFeatureAsProp
    };
  }, {});
  return allfeaturesAsProps;
};
