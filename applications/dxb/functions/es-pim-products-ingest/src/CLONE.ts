import { Category, Classification, Image, Product } from "@bmi/pim-types";
import { TwoOneIgnoreDictionary } from "./transformProducts";

export type ProductCategoryTree = {
  [category: string]: {
    name: string;
    values: Category[];
  };
};

export const findProductBrandLogoCode = (product: Product) =>
  product.categories?.find((category) => category.categoryType === "Brand")
    ?.code;

export const findMainImage = (images: Image[]) => {
  const groupedImages = groupImages(images);
  const imageSources = mapImages(groupedImages, "MASTER_IMAGE");
  //take the first of master images
  if (imageSources.length && imageSources[0].mainSource) {
    return imageSources[0].mainSource;
  }
  return "";
};

const groupImages = (images: readonly Image[]): Image[][] =>
  Object.values(groupByContainerId(images));

const groupByContainerId = (
  arr: readonly Image[]
): { [key: string]: Image[] } => {
  return arr.reduce((acc: { [key: string]: Image[] }, currentValue: Image) => {
    if (!acc[currentValue["containerId"]]) {
      acc[currentValue["containerId"]] = [];
    }
    acc[currentValue["containerId"]].push(currentValue);
    return acc;
  }, {});
};

const mapImages = (
  groupedImages: readonly Image[][],
  assetType: ImageAssetType
): ImageSources[] => {
  return groupedImages
    .map((images) => {
      const masterImages = images.filter(
        (image) =>
          image.assetType === assetType &&
          (image.format === "Product-Hero-Small-Desktop-Tablet" ||
            image.format === "Product-Color-Selector-Mobile")
      );
      return {
        mainSource: masterImages.find(
          (image) => image.format === "Product-Hero-Small-Desktop-Tablet"
        )?.url,
        thumbnail: masterImages.find(
          (image) => image.format === "Product-Color-Selector-Mobile"
        )?.url,
        altText: images.find(
          (image) => image.assetType === assetType && !image.format
        )?.name
      };
    })
    .filter((image) => image.mainSource || image.thumbnail);
};

export type ImageAssetType = "TECHNICAL_DRAWINGS" | "MASTER_IMAGE" | "GALLERY";

export type ImageSources = {
  mainSource?: string;
  thumbnail?: string;
  altText?: string;
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
  [classificationName: string]: TransformedMeasurementValue;
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

  const FEATURES = {
    LENGTH: `${classificationNamepace}/${MEASUREMENTS}.length`,
    WIDTH: `${classificationNamepace}/${MEASUREMENTS}.width`,
    HEIGHT: `${classificationNamepace}/${MEASUREMENTS}.height`,
    THICKNESS: `${classificationNamepace}/${MEASUREMENTS}.thickness`
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
              // eslint-disable-next-line security/detect-object-injection
              const productObject = carry[productCode];
              const measurements = productObject
                ? (productObject.measurements as TransformedMeasurementValue)
                : {};

              // eslint-disable-next-line security/detect-object-injection
              carry[productCode] = {
                ...productObject,
                measurements: {
                  ...measurements,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export const generateSubtitleValues = (classifications: Classification[]) => {
  const subtitleFeatureMap: { [key: string]: string[] } = {
    appearanceAttributes: ["colour", "textureFamily"]
  };

  // TODO: check if this needs to be made up of more attibutes??
  // const subtitleFeatureMap: { [key: string]: string[] } = {
  //   appearanceAttributes: [
  //     "colour",
  //     "textureFamily",
  //     "colourFamily",
  //     "variantAttribute"
  //   ],
  //   generalInformation: ["materials"]
  // };

  let allFetureValues: string[] = [];
  Object.keys(subtitleFeatureMap).forEach((classificationCode) => {
    const allClassificationAttributes = classifications.find(
      ({ code }) => code === classificationCode
    );
    // eslint-disable-next-line security/detect-object-injection
    const eligibleFeatures: string[] = subtitleFeatureMap[
      classificationCode
    ] as string[];

    if (
      allClassificationAttributes &&
      eligibleFeatures &&
      eligibleFeatures.length
    ) {
      eligibleFeatures.forEach((eligibleFeatureCode) => {
        const featureValues = (
          allClassificationAttributes?.features?.find((feature) =>
            // TODO: Remove lower caseing as part of DXB-3449
            feature.code
              .toLowerCase()
              .endsWith(eligibleFeatureCode.toLowerCase())
          )?.featureValues || []
        ).flatMap((featureValue) => featureValue.value);
        allFetureValues = [...allFetureValues, ...featureValues];
      });
    }
  });

  return allFetureValues.filter((value) => value.trim().length > 0).join(", ");
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return array.reduce<IndexedItemGroup<T>>((map, item) => {
    // eslint-disable-next-line security/detect-object-injection
    const itemKey = item[key];
    // eslint-disable-next-line security/detect-object-injection
    map[itemKey] = map[itemKey] || [];
    // eslint-disable-next-line security/detect-object-injection
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
          // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
          [featureCode.toUpperCase().replace(".", "$")]: nameAndCodeValues
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
