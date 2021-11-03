import { Link } from "gatsby";
import { result, uniqBy, groupBy, find, pickBy, sortBy, unionBy } from "lodash";
import { Props as ProductOverviewPaneProps } from "@bmi/product-overview-pane";
import {
  Category,
  Classification,
  FeatureValue,
  Image,
  Product,
  VariantOption,
  VariantOptionWithProduct
} from "../components/types/pim";
import { GalleryImageType } from "../templates/systemDetails/types";
import { getPathWithCountryCode } from "./path";

export const getProductUrl = (countryCode, path) =>
  getPathWithCountryCode(countryCode, path);

const getProductProp = (classifications, productCode, propName) =>
  classifications[productCode] ? classifications[productCode][propName] : null;

// Returns an array of all the values of a certain prop
const getAllValues = (classifications, propName) => {
  const alreadyFoundProps = new Set();

  return Object.entries(classifications).reduce(
    (allValues, [productCode, props]) => {
      const propValue = props[propName];

      if (!propValue) {
        return allValues;
      }

      const propIdentifier = getPropIdentifier[propName](propValue);

      if (alreadyFoundProps.has(propIdentifier)) {
        return allValues;
      }

      alreadyFoundProps.add(propIdentifier);

      return [...allValues, propValue];
    },
    []
  );
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

export const findMasterImageUrl = (images): string => {
  return result<string>(
    find(images, {
      assetType: "MASTER_IMAGE",
      format: "Product-Listing-Card-Large-Desktop"
    }),
    "url"
  );
};

export const findProductBrandLogoCode = (product: Product) => {
  return result<string>(
    find(product.categories, {
      categoryType: "Brands"
    }),
    "code"
  );
};

// typed this function as this is using all the same type and data in both
// system details page and also in product details page et.
//TODO: potentially change the type name to be more generic (SystemProductImageType => ProductImageType)
export const mapGalleryImages = (
  images: readonly Image[]
): GalleryImageType[] => {
  const imagesByFormat = Object.values(groupBy(images, "containerId"));
  const masterImageSet = imagesByFormat.filter(
    // NOTE: Only use one MASTER_IMAGE between the main product and the variant.
    (_images, index, self) => {
      return (
        self.findIndex((images) =>
          images.some(
            ({ assetType, format }) => format && assetType === "MASTER_IMAGE"
          )
        ) === index
      );
    }
  );
  const imageSets = [
    ...masterImageSet,
    ...imagesByFormat.filter((images) =>
      images.some((image) => image.assetType === "GALLERY")
    )
  ];

  return imageSets.map((images) => ({
    mainSource: result<string>(
      find(images, {
        format: "Product-Hero-Small-Desktop-Tablet"
      }),
      "url"
    ),
    thumbnail: result<string>(
      find(images, {
        format: "Product-Color-Selector-Mobile"
      }),
      "url"
    ),
    altText: images[0]?.altText || images[0].name
  }));
};

export const getColourThumbnailUrl = (images): string =>
  result(
    find(images, {
      format: "Product-Color-Selector-Mobile",
      assetType: "MASTER_IMAGE"
    }),
    "url"
  );

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

export type VariantCodeToPathMap = { [code: string]: string };
export type Options = { size: string };

// Find attributes like surface finish, color, etc, from classifications
// TODO: Try to consolidate with the "unique" approach.
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
  const mainProduct = product;

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
              thumbnailUrl: getColourThumbnailUrl([
                ...(product.images || []),
                ...(mainProduct.images || [])
              ])
            });
          }

          if (code === FEATURES.COLOUR_FAMILY) {
            carryProp("colourfamily", {
              name,
              value: featureValues ? featureValues[0] : "n/a",
              thumbnailUrl: getColourThumbnailUrl([
                ...(product.images || []),
                ...(mainProduct.images || [])
              ])
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
            carryProp("materials", {
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
  measurements: (prop) => getMeasurementKey(prop)
};

const getPropValue = (classification, propName) => {
  const prop = classification[propName];
  const getter = prop && getPropIdentifier[propName];

  return getter ? getter(prop) : undefined;
};

export const getProductAttributes = (
  productClassifications: ClassificationsPerProductMap,
  selfProduct: Product | VariantOption,
  countryCode: string,
  options: Options,
  variantCodeToPathMap: VariantCodeToPathMap
): ProductOverviewPaneProps["attributes"] => {
  const selectedSurfaceTreatment = getProductProp(
    productClassifications,
    selfProduct.code,
    "texturefamily"
  );
  const allSurfaceTreatments = getAllValues(
    productClassifications,
    "texturefamily"
  ).filter(Boolean);

  const selectedColour = getProductProp(
    productClassifications,
    selfProduct.code,
    "colour"
  );
  const allColours = getAllValues(productClassifications, "colour").filter(
    Boolean
  );

  const selectedSize = getProductProp(
    productClassifications,
    selfProduct.code,
    "measurements"
  );

  const allSizes = getAllValues(productClassifications, "measurements").filter(
    Boolean
  );

  // The last attribute should be "quantity", but I can't find any products having it.
  const propHierarchy = ["colour", "measurements", "???"];
  const getMasterProperty = (keys, hirarchy) =>
    hirarchy.filter((code) => keys.includes(code))[0];

  const findProductCode = (
    filter /*: { "texturefamily": string, "colour": string, "measurements": string } */,
    property
  ) => {
    filter = {
      colour: selectedColour ? selectedColour.value.value : undefined,
      texturefamily: selectedSurfaceTreatment
        ? selectedSurfaceTreatment.value.code
        : undefined,
      measurements: selectedSize ? getMeasurementKey(selectedSize) : undefined,
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
          filter[masterProperty]
        ) {
          return carry;
        }

        // NOTE: Not matching for the main product.
        if (!variantCodeToPathMap[productCode]) {
          return carry;
        }

        const matches = Object.entries(filter).filter(([key, value]) => {
          return getPropValue(classification, key) === value;
        }).length;

        if (carry.matches >= matches) {
          return carry;
        }

        return {
          matches,
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

    // If we don't find an exact match and we're not looking for the masterProperty
    // we return undefined, we don't need to find the closest match...
    if (
      bestMatch.matches < Object.keys(filter).length &&
      property !== masterProperty
    ) {
      return;
    }

    return bestMatch.productCode;
  };

  return [
    {
      name: allColours[0]?.name,
      type: "thumbnails",
      variants: allColours.map((color) => {
        // TODO: that bad deconstruct
        const {
          value: { value },
          thumbnailUrl
        } = color;
        const code = value;

        const variantCode = findProductCode(
          {
            colour: code
          },
          "colour"
        );

        return {
          label: value,
          isSelected: selectedColour && code === selectedColour.value.value,
          thumbnail: thumbnailUrl,
          ...(variantCode
            ? {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: getProductUrl(
                    countryCode,
                    variantCodeToPathMap[variantCode]
                  )
                }
              }
            : {})
        };
      })
    },
    {
      name: allSurfaceTreatments[0]?.name,
      type: "chips",
      variants: allSurfaceTreatments.map((surface) => {
        // TODO: that bad deconstruct
        const {
          value: { code, value }
        } = surface;
        const variantCode = findProductCode(
          {
            texturefamily: code
          },
          "texturefamily"
        );

        return {
          label: value,
          isSelected:
            selectedSurfaceTreatment &&
            code === selectedSurfaceTreatment.value.code,
          ...(variantCode
            ? {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: getProductUrl(
                    countryCode,
                    variantCodeToPathMap[variantCode]
                  )
                }
              }
            : {})
        };
      })
    },
    {
      name: options.size || "Size",
      type: "chips",
      variants: allSizes.map((size) => {
        const key = getMeasurementKey(size);
        const variantCode = findProductCode(
          {
            measurements: key
          },
          "measurements"
        );

        return {
          label: getSizeLabel(size),
          isSelected: key === getMeasurementKey(selectedSize),
          ...(variantCode
            ? {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: getProductUrl(
                    countryCode,
                    variantCodeToPathMap[variantCode]
                  )
                }
              }
            : {})
        };
      })
    }
  ];
};

const IGNORED_ATTRIBUTES = [
  "scoringWeightAttributes.scoringweight",
  "appearanceAttributes.colourfamily"
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
      !IGNORED_CLASSIFICATIONS.includes(features && features[0].code)
  );
  return classificationsToReturn;
};

export const getValidFeatures = (classificationNamespace: string, features) => {
  if (!features || !features.length) return [];

  const IGNORED_CLASSIFICATIONS = IGNORED_ATTRIBUTES.map(
    (value) => `${classificationNamespace}/${value}`
  );
  const featureToReturn = sortBy(
    features.filter(({ code }) => !IGNORED_CLASSIFICATIONS.includes(code)),
    "name"
  );

  return featureToReturn;
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
      tabs[tabCategory.name] = [...(tabs[tabCategory.name] || []), product];
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
  return pickBy(variantClassifications, (value, code) => {
    const getter = getPropIdentifier[code];
    const baseValues = baseClassifications[code] || [];
    // If all the values are the same, we'll get a single value
    const allSameValue =
      getter && uniqBy(baseValues, (value) => getter(value)).length === 1;

    // AND if number of base values is equal to number of variants, all variants have the same value
    // Therefore it's common
    return !(baseValues.length === numberOfVariants && allSameValue);
  });
};

// TODO: Is there not a function to get a render value of a classification?
export const mapClassificationValues = (
  classificationsMap: TransformedClassificationsMap
) => {
  return Object.entries(classificationsMap)
    .map(([key, classification]) => {
      if (["colour", "texturefamily"].includes(key)) {
        // TODO: Hmmmmmmm
        const value = classification.value;
        return typeof value === "object" ? value.value : value;
      }

      if (key === "measurements") {
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
    classificationNamespace
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
    variant._product.variantOptions.length
  );
};

// need to merge product and self classifications
//such that the variant feature values are merged with product features
export const getMergedClassifications = (
  pimClassificationCatalogueNamespace: string,
  selfProduct: Product | VariantOption,
  product: Product
) => {
  const unionClassifications = unionBy(
    [],
    selfProduct.classifications || [],
    product.classifications || []
  );
  const groupedClassifications: {
    [index: string]: Classification[];
  } = groupBy(unionClassifications, (item) => item.code);

  const mergedClassifications: Classification[] = Object.values<
    Classification[]
  >(groupedClassifications).map((classifications: Classification[]) =>
    classifications.reduce<Classification>(
      (prevValue, currValue) => {
        const mergedFeatures = sortBy(
          unionBy(
            prevValue.features,
            currValue.features,
            (feature) => feature.code
          ),
          (feature) => feature.name
        );
        return {
          ...prevValue,
          ...currValue,
          features: mergedFeatures
        };
      },
      { features: [] } as Classification
    )
  );

  return sortBy(
    getValidClassification(
      pimClassificationCatalogueNamespace,
      uniqBy(mergedClassifications, (item) => item.code)
    ),
    (item) => item.code
  );
};
