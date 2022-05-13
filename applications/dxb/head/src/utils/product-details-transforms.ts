import { Link } from "gatsby";
import { MediaData, ProductOverviewPaneProps } from "@bmi/components";
import React from "react";
import { filterTwoOneAttributes } from "@bmi/pim-types";
import {
  Category,
  Classification,
  ClassificationCodeEnum,
  FeatureCodeEnum,
  FeatureValue,
  Image,
  ImageAssetTypesEnum,
  ImageFormatEnum,
  Product,
  VariantOption,
  VariantOptionWithProduct
} from "../components/types/pim";
import { GalleryImageType } from "../templates/systemDetails/types";
import { getPathWithCountryCode } from "./path";
import { combineVariantClassifications } from "./filters";
import groupBy from "./groupBy";

export const getProductUrl = (countryCode, path) =>
  getPathWithCountryCode(countryCode, path);

const getProductProp = (classifications, productCode, propName) =>
  // eslint-disable-next-line security/detect-object-injection
  classifications[productCode] ? classifications[productCode][propName] : null;

// Returns an array of all the values of a certain prop
const getAllValues = (
  classifications: ClassificationsPerProductMap,
  propName: string
) => {
  const alreadyFoundProps = new Set();

  const allValuesArray = Object.entries(classifications).reduce(
    (allValues, [_, props]) => {
      // eslint-disable-next-line security/detect-object-injection
      const propValue = props[propName];

      if (!propValue) {
        return allValues;
      }

      // eslint-disable-next-line security/detect-object-injection
      const propIdentifier = getPropIdentifier[propName](propValue);

      if (alreadyFoundProps.has(propIdentifier)) {
        return allValues;
      }

      alreadyFoundProps.add(propIdentifier);
      return [...allValues, propValue];
    },
    []
  );

  return allValuesArray.sort((a, b) => {
    const isMeasurements = propName === ClassificationCodeEnum.MEASUREMENTS;
    if (isMeasurements) {
      // sort Measurements object on the same level by string number value
      return Object.keys(a).reduce((prev, _, index) => {
        // return the prev result if result has been decided.
        if (prev !== 0) return prev;
        // eslint-disable-next-line security/detect-object-injection
        const valueA = parseInt(a[Object.keys(a)[index]]?.value.value.value);
        // eslint-disable-next-line security/detect-object-injection
        const valueB = parseInt(b[Object.keys(b)[index]]?.value.value.value);
        if (!valueA || !valueB) return 0;
        return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
      }, 0);
    }
    return a.value.value < b.value.value ? -1 : 1;
  });
};

// String represenatation of a measurement without unit to be used as a key
const getMeasurementKey = (measurement) => {
  return getSizeLabel(measurement, false);
};

// String representation of a measurement for UI
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

export const findMasterImageUrl = (images: readonly Image[] | null): string =>
  images?.find(
    (image) =>
      image.assetType === ImageAssetTypesEnum.MASTER_IMAGE &&
      image.format == ImageFormatEnum.PRODUCT_LISTING_CARD_SMALL_DESKTOP_TABLET
  )?.url;

export const findProductBrandLogoCode = (product: Product) =>
  product.categories.find((category) => category.categoryType === "Brand")
    ?.code;

export const transformImages = (
  images: readonly GalleryImageType[]
): readonly MediaData[] => {
  return images.map(({ mainSource, thumbnail, altText }) => ({
    media: React.createElement("img", {
      src: mainSource,
      alt: altText
    } as HTMLImageElement),
    thumbnail
  }));
};

export const groupImage = (
  arr: Image[] = [],
  criteria: string
): { [key: string]: Image[] } => {
  return arr.reduce((acc: { [key: string]: Image[] }, currentValue: Image) => {
    // eslint-disable-next-line security/detect-object-injection
    if (!acc[currentValue[criteria]]) {
      // eslint-disable-next-line security/detect-object-injection
      acc[currentValue[criteria]] = [];
    }
    // eslint-disable-next-line security/detect-object-injection
    acc[currentValue[criteria]].push(currentValue);
    return acc;
  }, {});
};

// typed this function as this is using all the same type and data in both
// system details page and also in product details page et.
//TODO: potentially change the type name to be more generic (SystemProductImageType => ProductImageType)
export const mapGalleryImages = (
  images: readonly Image[]
): GalleryImageType[] => {
  const imagesByFormat: Image[][] = Object.values(
    groupImage([...(images || [])], "containerId")
  );
  const masterImageSet = imagesByFormat.filter(
    // NOTE: Only use one MASTER_IMAGE between the main product and the variant.
    (_images, index, self) => {
      return (
        self.findIndex((images) =>
          images.some(
            ({ assetType, format }) =>
              format && assetType === ImageAssetTypesEnum.MASTER_IMAGE
          )
        ) === index
      );
    }
  );
  const imageSets = [
    ...masterImageSet,
    ...imagesByFormat.filter((images) =>
      images.some((image) => image.assetType === ImageAssetTypesEnum.GALLERY)
    )
  ];

  return convertImageSetToMediaFormat(imageSets);
};

export const convertImageSetToMediaFormat = (
  imageSets: Image[][]
): GalleryImageType[] => {
  return imageSets.map((images) => ({
    mainSource: images.find(
      (image) =>
        image.format === ImageFormatEnum.PRODUCT_HERO_SMALL_DESKTOP_TABLET
    )?.url,
    thumbnail: images.find(
      (image) => image.format === ImageFormatEnum.PRODUCT_COLOR_SELECTOR_MOBILE
    )?.url,
    altText: images[0]?.altText || images[0]?.name
  }));
};

export const getColourThumbnailUrl = (images): string | undefined =>
  images.find(
    (image) =>
      image.format === ImageFormatEnum.PRODUCT_COLOR_SELECTOR_MOBILE &&
      image.assetType === ImageAssetTypesEnum.MASTER_IMAGE
  )?.url;

export type TransformedClassificationValue = {
  name: string;
  value: FeatureValue | "n/a";
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
type ClassificationsPerProductMap = {
  [productCode: string]: TransformedClassificationsMap;
};
type AllClassificationsValues = {
  [productCode: string]: TransformedClassificationsMap[];
};

export enum UnavailableMicroCopiesEnum {
  COLOUR = "color",
  SIZE = "size",
  VARIANT_ATTRIBUTE = "variantattribute",
  TEXTURE_FAMILY = "texturefamily"
}

export type VariantCodeToPathMap = { [code: string]: string };
export type Options = { size: string; variantattribute: string };
export type UnavailableMicroCopies = Record<UnavailableMicroCopiesEnum, string>;

// Find attributes like surface finish, color, etc, from classifications
// TODO: Try to consolidate with the "unique" approach.
export const mapProductClassifications = (
  product: Pick<
    Product,
    "code" | "images" | "classifications" | "variantOptions"
  >,
  classificationNamepace: string,
  includeVariantScoringWeight = false
): ClassificationsPerProductMap => {
  const allProducts: {
    [productCode: string]: Product;
  } = {
    ...(!product.variantOptions && { [product.code]: product }),
    ...(product.variantOptions || []).reduce((variantProducts, variant) => {
      return {
        ...variantProducts,
        [variant.code]: {
          ...variant,
          classifications: combineVariantClassifications(
            product,
            variant,
            includeVariantScoringWeight
          )
        }
      };
    }, {})
  };

  const mainProduct = product;

  // Classifications
  const SCORE_WEIGHT = "scoringWeightAttributes";
  const APPEARANCE = "appearanceAttributes";
  const MEASUREMENTS = ClassificationCodeEnum.MEASUREMENTS;
  const GENERAL_INFORMATION = "generalInformation";

  const FEATURES = {
    SCORE_WEIGHT: `${classificationNamepace}/${SCORE_WEIGHT}.${FeatureCodeEnum.SCORE_WEIGHT}`,
    TEXTURE_FAMILY: `${classificationNamepace}/${APPEARANCE}.${FeatureCodeEnum.TEXTURE_FAMILY}`,
    COLOUR: `${classificationNamepace}/${APPEARANCE}.${FeatureCodeEnum.COLOUR}`,
    COLOUR_FAMILY: `${classificationNamepace}/${APPEARANCE}.${FeatureCodeEnum.COLOUR_FAMILY}`,
    VARIANT_ATTRIBUTE: `${classificationNamepace}/${APPEARANCE}.${FeatureCodeEnum.VARIANT_ATTRIBUTE}`,
    LENGTH: `${classificationNamepace}/${MEASUREMENTS}.${FeatureCodeEnum.LENGTH}`,
    WIDTH: `${classificationNamepace}/${MEASUREMENTS}.${FeatureCodeEnum.WIDTH}`,
    HEIGHT: `${classificationNamepace}/${MEASUREMENTS}.${FeatureCodeEnum.HEIGHT}`,
    THICKNESS: `${classificationNamepace}/${MEASUREMENTS}.${FeatureCodeEnum.THICKNESS}`,
    MATERIALS: `${classificationNamepace}/${GENERAL_INFORMATION}.${FeatureCodeEnum.MATERIALS}`
  };

  return Object.entries(allProducts).reduce((carry, [productCode, variant]) => {
    (variant.classifications || []).forEach((classification) => {
      const { code, features } = classification;

      const carryProp = (
        propName: string,
        value: TransformedClassificationValue | TransformedMeasurementValue
      ) => {
        // eslint-disable-next-line security/detect-object-injection
        carry[productCode] = {
          // eslint-disable-next-line security/detect-object-injection
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

        carryProp(FeatureCodeEnum.SCORE_WEIGHT, {
          name: classification.name,
          value: valueFeature ? valueFeature.featureValues[0] : "n/a"
        });
      }

      if (code === APPEARANCE) {
        features.forEach(({ code, name, featureValues }) => {
          if (code === FEATURES.TEXTURE_FAMILY) {
            carryProp(FeatureCodeEnum.TEXTURE_FAMILY, {
              name,
              value: featureValues ? featureValues[0] : "n/a"
            });
          }

          if (code === FEATURES.COLOUR) {
            carryProp(FeatureCodeEnum.COLOUR, {
              name,
              value: featureValues ? featureValues[0] : "n/a",
              thumbnailUrl: getColourThumbnailUrl([
                ...(variant.images || []),
                ...(mainProduct.images || [])
              ])
            });
          }

          if (code === FEATURES.COLOUR_FAMILY) {
            carryProp(FeatureCodeEnum.COLOUR_FAMILY, {
              name,
              value: featureValues ? featureValues[0] : "n/a",
              thumbnailUrl: getColourThumbnailUrl([
                ...(variant.images || []),
                ...(mainProduct.images || [])
              ])
            });
          }

          if (code === FEATURES.VARIANT_ATTRIBUTE) {
            carryProp(FeatureCodeEnum.VARIANT_ATTRIBUTE, {
              name,
              value: featureValues ? featureValues[0] : "n/a"
            });
          }
        });
      }

      if (code === MEASUREMENTS) {
        features.forEach(({ code, name, featureValues, featureUnit }) => {
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
                [code.split(".").pop()]: {
                  name,
                  value: {
                    value: featureValues ? featureValues[0] : "n/a",
                    unit: featureUnit?.symbol
                  }
                }
              }
            };
          }
        });
      }

      if (code === GENERAL_INFORMATION) {
        features.forEach(({ code, name, featureValues }) => {
          if (code === FEATURES.MATERIALS) {
            carryProp(FeatureCodeEnum.MATERIALS, {
              name,
              value: featureValues ? featureValues[0] : "n/a"
            });
          }
        });
      }
    });

    return carry;
  }, {});
};

const getPropIdentifier = {
  texturefamily: (prop) => prop.value.code,
  colour: (prop) => prop.value.value, // UGH! Colour doesn't have a code!
  colourfamily: (prop) => prop.value.code,
  measurements: (prop) => getMeasurementKey(prop),
  variantattribute: (prop) => prop.value.value
};

const getPropValue = (classification, propName) => {
  // eslint-disable-next-line security/detect-object-injection
  const prop = classification[propName];
  // eslint-disable-next-line security/detect-object-injection
  const getter = prop && getPropIdentifier[propName];

  return getter ? getter(prop) : undefined;
};

export const getProductAttributes = (
  productClassifications: ClassificationsPerProductMap,
  selfProduct: Product | VariantOption,
  countryCode: string,
  options: Options,
  variantCodeToPathMap: VariantCodeToPathMap,
  unavailableMicroCopies: UnavailableMicroCopies
): ProductOverviewPaneProps["attributes"] => {
  const sortedProductClassification = Object.entries(
    productClassifications
  ).sort(([_, a], [__, b]) => {
    const sortingOrder = [
      FeatureCodeEnum.COLOUR,
      FeatureCodeEnum.COLOUR_FAMILY,
      FeatureCodeEnum.TEXTURE_FAMILY,
      ClassificationCodeEnum.MEASUREMENTS,
      FeatureCodeEnum.VARIANT_ATTRIBUTE
    ];
    return sortingOrder.reduce((prev, propName) => {
      // return the prev result if result has been decided.
      // eslint-disable-next-line security/detect-object-injection
      if (prev !== 0 || !a[propName]) return prev;
      const valueA = getPropValue(a, propName);
      const valueB = getPropValue(b, propName);
      return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
    }, 0);
  });

  const selectedSurfaceTreatment = getProductProp(
    productClassifications,
    selfProduct.code,
    FeatureCodeEnum.TEXTURE_FAMILY
  );
  const allSurfaceTreatments = getAllValues(
    productClassifications,
    FeatureCodeEnum.TEXTURE_FAMILY
  ).filter(Boolean);

  const selectedColour = getProductProp(
    productClassifications,
    selfProduct.code,
    FeatureCodeEnum.COLOUR
  );
  const allColours = getAllValues(
    productClassifications,
    FeatureCodeEnum.COLOUR
  ).filter(Boolean);

  const selectedSize = getProductProp(
    productClassifications,
    selfProduct.code,
    ClassificationCodeEnum.MEASUREMENTS
  );

  const allSizes = getAllValues(
    productClassifications,
    ClassificationCodeEnum.MEASUREMENTS
  ).filter(Boolean);

  const selectedVariantAttribute = getProductProp(
    productClassifications,
    selfProduct.code,
    FeatureCodeEnum.VARIANT_ATTRIBUTE
  );

  const allVariantAttributes = getAllValues(
    productClassifications,
    FeatureCodeEnum.VARIANT_ATTRIBUTE
  ).filter(Boolean);

  const propHierarchy = [
    { propName: FeatureCodeEnum.COLOUR, values: allColours },
    { propName: "colourFamily", values: allColours },
    { propName: FeatureCodeEnum.TEXTURE_FAMILY, values: allSurfaceTreatments },
    { propName: ClassificationCodeEnum.MEASUREMENTS, values: allSizes },
    {
      propName: FeatureCodeEnum.VARIANT_ATTRIBUTE,
      values: allVariantAttributes
    }
  ].reduce((carry, { propName, values }) => {
    if (values.length <= 0) return carry;
    return [...carry, propName];
  }, []);

  const getMasterProperty = (keys, hirarchy) =>
    hirarchy.filter((code) => keys.includes(code))[0];

  const findProductCode = (filter, property) => {
    filter = {
      colour: selectedColour ? selectedColour.value.value : undefined,
      texturefamily: selectedSurfaceTreatment
        ? selectedSurfaceTreatment.value.code
        : undefined,
      measurements: selectedSize ? getMeasurementKey(selectedSize) : undefined,
      variantattribute: selectedVariantAttribute
        ? selectedVariantAttribute.value.value
        : undefined,
      ...filter
    };

    const masterProperty = getMasterProperty(
      Object.keys(filter),
      propHierarchy
    );

    const bestMatch = Object.entries(productClassifications).reduce(
      (carry, [productCode, classification]) => {
        // The root prop must match
        if (
          getPropValue(classification, masterProperty) !==
          // eslint-disable-next-line security/detect-object-injection
          filter[masterProperty]
        ) {
          return carry;
        }

        // NOTE: Not matching for the main product.
        // eslint-disable-next-line security/detect-object-injection
        if (!variantCodeToPathMap[productCode]) {
          return carry;
        }

        const matches = Object.entries(filter).filter(([key, value]) => {
          if (
            !value ||
            propHierarchy.indexOf(key) > propHierarchy.indexOf(property)
          )
            return false;
          return getPropValue(classification, key) === value;
        });

        if (carry.matches >= matches.length) {
          return carry;
        }

        return {
          matches: matches.length,
          classification,
          productCode
        };
      },
      {
        matches: 0,
        classification: null,
        productCode: null
      }
    );

    if (!bestMatch.matches) {
      return;
    }

    if (bestMatch.matches < propHierarchy.indexOf(property)) {
      return;
    }

    return bestMatch.productCode;
  };

  // colour availability is based on all other selected values
  const checkColourAvailability = (value: string) => {
    const variants = [
      {
        value: selectedSurfaceTreatment && selectedSurfaceTreatment.value.code,
        propName: FeatureCodeEnum.TEXTURE_FAMILY
      },
      {
        value: selectedSize && getMeasurementKey(selectedSize),
        propName: ClassificationCodeEnum.MEASUREMENTS
      },
      {
        value: selectedVariantAttribute && selectedVariantAttribute.value.value,
        propName: FeatureCodeEnum.VARIANT_ATTRIBUTE
      }
    ].filter(({ value }) => !!value);
    if (variants.length === 0) return true;
    const allColourVariants = Object.entries(productClassifications).filter(
      ([_, classifications]) => {
        return getPropValue(classifications, FeatureCodeEnum.COLOUR) === value;
      }
    );
    const matchColourVariants = allColourVariants.filter(
      ([_, classifications]) => {
        const matches = variants.reduce(
          (prev, { value: variantValue, propName }) => {
            if (getPropValue(classifications, propName) === variantValue) {
              return [...prev, propName];
            }
            return prev;
          },
          []
        );
        return matches.length === variants.length;
      }
    );
    return matchColourVariants.length > 0;
  };

  const getBestMatch = (variant: string, propName: string) =>
    sortedProductClassification.filter(([_, classifications]) => {
      const value = getPropValue(classifications, propName);
      return value && value === variant;
    });

  const getUnavailableCTA = (variant: string, propName: string) => {
    const bestMatch = getBestMatch(variant, propName);
    const variantPath = variantCodeToPathMap[bestMatch[0][0]];
    return variantPath && bestMatch.length > 0
      ? getProductUrl(countryCode, variantPath)
      : null;
  };

  return [
    {
      name: allColours[0]?.name,
      type: "thumbnails",
      unavailableMicroCopy: unavailableMicroCopies.color,
      variants: allColours.map(({ value: { value: code }, thumbnailUrl }) => {
        const variantCode = findProductCode(
          {
            colour: code
          },
          FeatureCodeEnum.COLOUR
        );
        const isSelected =
          selectedColour && code === selectedColour.value.value;
        const path = variantCode
          ? // eslint-disable-next-line security/detect-object-injection
            getProductUrl(countryCode, variantCodeToPathMap[variantCode])
          : getUnavailableCTA(code, FeatureCodeEnum.COLOUR);
        return {
          label: code,
          isSelected,
          thumbnail: thumbnailUrl,
          availability: checkColourAvailability(code),
          ...(!isSelected &&
            allColours.length > 1 &&
            path && {
              action: {
                model: "routerLink",
                linkComponent: Link,
                to: variantCode
                  ? getProductUrl(
                      countryCode,
                      // eslint-disable-next-line security/detect-object-injection
                      variantCodeToPathMap[variantCode]
                    )
                  : getUnavailableCTA(code, FeatureCodeEnum.COLOUR)
              }
            })
        };
      })
    },
    {
      name: allSurfaceTreatments[0]?.name,
      type: "chips",
      unavailableMicroCopy: unavailableMicroCopies.texturefamily,
      variants: allSurfaceTreatments.map((surface) => {
        // TODO: that bad deconstruct
        const {
          value: { code, value }
        } = surface;
        const variantCode = findProductCode(
          {
            texturefamily: code
          },
          FeatureCodeEnum.TEXTURE_FAMILY
        );
        const isSelected =
          selectedSurfaceTreatment &&
          code === selectedSurfaceTreatment.value.code;
        const path = variantCode
          ? // eslint-disable-next-line security/detect-object-injection
            getProductUrl(countryCode, variantCodeToPathMap[variantCode])
          : getUnavailableCTA(code, FeatureCodeEnum.TEXTURE_FAMILY);
        return {
          label: value,
          isSelected,
          availability: !!variantCode,
          ...(!isSelected &&
            path &&
            allSurfaceTreatments.length > 1 && {
              action: {
                model: "routerLink",
                linkComponent: Link,
                to: path
              }
            })
        };
      })
    },
    {
      name: options.size || "Size",
      type: "chips",
      unavailableMicroCopy: unavailableMicroCopies.size,
      variants: allSizes.map((size) => {
        const key = getMeasurementKey(size);
        const variantCode = findProductCode(
          {
            measurements: key
          },
          ClassificationCodeEnum.MEASUREMENTS
        );
        const isSelected = key === getMeasurementKey(selectedSize);
        const path = variantCode
          ? // eslint-disable-next-line security/detect-object-injection
            getProductUrl(countryCode, variantCodeToPathMap[variantCode])
          : getUnavailableCTA(key, ClassificationCodeEnum.MEASUREMENTS);
        return {
          label: getSizeLabel(size),
          isSelected,
          availability: !!variantCode,
          ...(!isSelected &&
            path &&
            allSizes.length > 1 && {
              action: {
                model: "routerLink",
                linkComponent: Link,
                to: path
              }
            })
        };
      })
    },
    {
      name: options.variantattribute,
      type: "chips",
      unavailableMicroCopy: unavailableMicroCopies.variantattribute,
      variants: allVariantAttributes.map(({ value: { value } }) => {
        const variantCode = findProductCode(
          {
            variantattribute: value
          },
          FeatureCodeEnum.VARIANT_ATTRIBUTE
        );
        const isSelected =
          (selectedVariantAttribute &&
            selectedVariantAttribute.value.value === value) ||
          false;
        const path = variantCode
          ? // eslint-disable-next-line security/detect-object-injection
            getProductUrl(countryCode, variantCodeToPathMap[variantCode])
          : getUnavailableCTA(value, FeatureCodeEnum.VARIANT_ATTRIBUTE);
        return {
          label: value,
          isSelected,
          availability: !!variantCode,
          ...(!isSelected &&
            path &&
            allVariantAttributes.length > 1 && {
              action: {
                model: "routerLink",
                linkComponent: Link,
                to: path
              }
            })
        };
      })
    }
  ];
};

// TODO: DXB-3449 - remove uppercasing when PIM has completed BPN-1055
const IGNORED_ATTRIBUTES = [
  "SCORINGWEIGHTATTRIBUTES.SCORINGWEIGHT",
  "APPEARANCEATTRIBUTES.COLOURFAMILY"
];

export const getValidClassification = (
  classificationNamespace: string,
  classifications: Array<Classification>
): Array<Classification> => {
  const IGNORED_CLASSIFICATIONS = IGNORED_ATTRIBUTES.map(
    (value) => `${classificationNamespace}/${value}`
  );

  const classificationsToReturn = classifications.filter(
    ({ features }) =>
      // TODO: DXB-3449 - remove uppercasing when PIM has completed BPN-1055
      !IGNORED_CLASSIFICATIONS.includes(
        features && features.length && features[0].code.toUpperCase()
      )
  );
  return classificationsToReturn;
};

export const getValidFeatures = (classificationNamespace: string, features) => {
  if (!features || !features.length) return [];

  const IGNORED_CLASSIFICATIONS = IGNORED_ATTRIBUTES.map(
    (value) => `${classificationNamespace}/${value}`
  );

  // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
  return features
    .filter(({ code }) => !IGNORED_CLASSIFICATIONS.includes(code.toUpperCase()))
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
};

type CategoryPath = readonly Category[];

export type ProductCategoryTree = {
  [category: string]: {
    name: string;
    values: Category[];
  };
};

// Second from last leaf category, which denotes top most parent category of a path
export const getGroupCategory = (branch: CategoryPath) =>
  branch[branch.length - 2];

export const getLeafCategory = (branch: CategoryPath) =>
  branch[branch.length - 1];

// NOTE: This starts from the root category, so technically is a depth first
// TODO: This may not be 100% accurate, when it comes to multiple overlapping categories
export const getFullCategoriesPaths = (
  categories: readonly Category[]
): CategoryPath[] => {
  categories = categories.filter(
    ({ categoryType }) => categoryType === "Category"
  );

  const roots = categories.filter(
    ({ parentCategoryCode }) => parentCategoryCode === ""
  );

  return roots.map((rootCategory) => {
    let path = [rootCategory];
    let currentNode = rootCategory;

    while (currentNode) {
      currentNode = categories.find(
        ({ parentCategoryCode }) => parentCategoryCode === currentNode.code
      );

      if (currentNode) {
        path = [...path, currentNode];
      }
    }

    return path;
  });
};

// Collects all "categories" from products but only if they have variantOptions
// As only variants are shown
export const findAllCategories = (products: readonly Product[]) => {
  const allCategoryPaths = products
    .filter(({ variantOptions }) => variantOptions)
    // Temporary tweak or leave it like this to be more resilient?
    .map(({ categories }) =>
      categories ? getFullCategoriesPaths(categories) : []
    )
    .reduce((allPaths, productPaths) => [...allPaths, ...productPaths], []);

  return allCategoryPaths.reduce<ProductCategoryTree>((tree, path) => {
    const groupCategory = getGroupCategory(path);
    const leafCategory = getLeafCategory(path);

    // NOTE: Path shorter than 2 is invalid, it will not find groupCategory
    if (!(groupCategory && leafCategory)) {
      return tree;
    }

    // If not found set to initial value
    const group = tree[groupCategory.code] || {
      name: groupCategory.name,
      values: []
    };
    const existingValue = group.values.find(
      ({ code }) => code === leafCategory.code
    );

    // Skip if already has value
    if (existingValue) {
      return tree;
    } else {
      return {
        ...tree,
        [groupCategory.code]: {
          ...group,
          values: [...group.values, leafCategory]
        }
      };
    }
  }, {});
};

/**
 * Groups resolved product category paths by the 2nd last category in the path
 */
export const groupProductsByCategory = (
  products: ReadonlyArray<Product>
): Record<string, ReadonlyArray<Product>> => {
  const tabs = {};

  products.map((product) => {
    const categoryBranches = getFullCategoriesPaths(product.categories || []);

    categoryBranches.forEach((branch) => {
      const tabCategory = getGroupCategory(branch);
      if (tabCategory) {
        tabs[tabCategory.name] = [...(tabs[tabCategory.name] || []), product];
      }
    });
  });

  return tabs;
};

// returns classifications in variantClassifications whose value is not the same across all baseClassifications
// baseClassifications is a groupping of all the collections values by collection types
const findUniqueClassificationsOnVariant = (
  baseClassifications: AllClassificationsValues,
  variantClassifications: TransformedClassificationsMap,
  numberOfVariants = 1
): TransformedClassificationsMap => {
  const uniqueClassifications = {};
  for (const code in variantClassifications) {
    // eslint-disable-next-line security/detect-object-injection
    const getter = getPropIdentifier[code];
    // eslint-disable-next-line security/detect-object-injection
    const baseValues = baseClassifications[code] || [];
    const allSameValue =
      getter &&
      baseValues.reduce((values, value) => {
        const key = getter(value);
        if (!values.has(key)) {
          values.set(key, value);
        }
        return values;
      }, new Map()).size === 1;
    if (!(baseValues.length === numberOfVariants && allSameValue)) {
      // eslint-disable-next-line security/detect-object-injection
      uniqueClassifications[code] = variantClassifications[code];
    }
  }
  return uniqueClassifications;
};

// TODO: Is there not a function to get a render value of a classification?
export const mapClassificationValues = (
  classificationsMap: TransformedClassificationsMap
) => {
  return Object.entries(classificationsMap)
    .map(([key, classification]) => {
      if (
        [FeatureCodeEnum.COLOUR, FeatureCodeEnum.TEXTURE_FAMILY].includes(
          key as FeatureCodeEnum
        )
      ) {
        // TODO: Hmmmmmmm
        const value = classification.value;
        return typeof value === "object" ? value.value : value;
      }

      if (key === ClassificationCodeEnum.MEASUREMENTS) {
        return getSizeLabel(classification as TransformedMeasurementValue);
      }
    })
    .filter(Boolean)
    .join(", ");
};

export const findUniqueVariantClassifications = (
  variant: VariantOptionWithProduct,
  classificationNamespace: string
) => {
  const classifications = mapProductClassifications(
    variant._product,
    classificationNamespace,
    true
  );

  const mergeClassificationsValues = (
    base: AllClassificationsValues,
    others: TransformedClassificationsMap
  ): AllClassificationsValues => {
    return {
      ...base,
      ...Object.entries(others).reduce((agg, [code, value]) => {
        return {
          ...agg,
          // eslint-disable-next-line security/detect-object-injection
          [code]: [...(base[code] || []), value]
        };
      }, {})
    };
  };

  // Gather all classifications into a single classifications map
  const allClassificationValues = Object.values(
    classifications
  ).reduce<AllClassificationsValues>((allClassifications, classifications) => {
    return mergeClassificationsValues(allClassifications, classifications);
  }, {});

  return findUniqueClassificationsOnVariant(
    allClassificationValues,
    classifications[variant.code] || {},
    variant._product.totalVariantCount || 1
  );
};

// need to merge product and self classifications
//such that the variant feature values are merged with product features
export const getMergedClassifications = (
  pimClassificationCatalogueNamespace: string,
  selfProduct: Product | VariantOption,
  product: Product
) => {
  const unionClassifications: Classification[] = [
    ...(selfProduct.classifications || []),
    ...(product.classifications || [])
  ].reduce((classifications, classification) => {
    classifications.find((clas) => clas === classification) ||
      classifications.push(classification);
    return classifications;
  }, []);
  const groupedClassifications: {
    [index: string]: Classification[];
  } = groupBy(unionClassifications, "code");

  const mergedClassifications: Classification[] = Object.values<
    Classification[]
  >(groupedClassifications).map((classifications: Classification[]) =>
    classifications.reduce<Classification>(
      (prevValue, currValue) => {
        const mergedFeatures = filterTwoOneAttributes(
          pimClassificationCatalogueNamespace,
          currValue.code,
          [...prevValue.features, ...currValue.features]
        )
          .reduce((features, feature) => {
            features.find((feat) => feat.code === feature.code) ||
              features.push(feature);
            return features;
          }, [])
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
        return {
          ...prevValue,
          ...currValue,
          features: mergedFeatures
        };
      },
      { features: [] } as Classification
    )
  );

  return getValidClassification(
    pimClassificationCatalogueNamespace,
    mergedClassifications.reduce((classifications, classification) => {
      classifications.find((clas) => clas.code === classification.code) ||
        classifications.push(classification);
      return classifications;
    }, [])
  )
    .filter((classification) => classification.features.length)
    .sort((a, b) => (a.code > b.code ? 1 : a.code < b.code ? -1 : 0));
};

export const getYoutubeId = (urlOrCode: string) => {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?.*v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*/;
  const match = urlOrCode?.match(regExp);
  return match?.length ? match[1] : urlOrCode;
};

export const getDefaultPreviewImage = (videoUrl: string) =>
  `https://i.ytimg.com/vi/${getYoutubeId(videoUrl)}/maxresdefault.jpg`;
