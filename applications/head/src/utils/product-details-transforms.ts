import { Link } from "gatsby";
import _ from "lodash";
import { Product } from "../templates/product-details-page";
import { Props as ProductOverviewPaneProps } from "@bmi/product-overview-pane";

const getSlug = (string) => string.toLowerCase().replace(/[-_\s]+/gi, "-");
export const getProductUrl = (countryCode, productCode) =>
  `/${countryCode}/products/${getSlug(productCode)}`;

const getProductProp = (classifications, productCode, propName) =>
  classifications[productCode] ? classifications[productCode][propName] : null;

// Returns an array of all the values of a certain prop
const getAllValues = (classifications, propName) => {
  const alreadyFoundProps = new Set();

  const getPropIdentifier = {
    texturefamily: (prop) => prop.value.code,
    colourfamily: (prop) => prop.value.code,
    measurements: (prop) => getMeasurementKey(prop)
  };

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

const getSizeLabel = (measurement) => {
  if (!measurement) {
    return "No Size";
  }

  const { length, width, height } = measurement;

  return [length, width, height]
    .filter(Boolean)
    .map(({ value }) => value.value) // LOL
    .join("x");
};

export const findMasterImageUrl = (images): string => {
  return _.result<string>(
    _.find(images, {
      assetType: "MASTER_IMAGE",
      format: "Product-Listing-Card-Large-Desktop"
    }),
    "url"
  );
};

export const findProductBrandLogoCode = (product) => {
  return _.result<string>(
    _.find(product.categories, {
      parentCategoryCode: "BMI_Brands"
    }),
    "code"
  );
};

export const mapGalleryImages = (images) => {
  const imageSets = Object.values(_.groupBy(images, "containerId")).filter(
    // NOTE: Only use one MASTER_IMAGE between the main product and the variant.
    (_images, index, self) => {
      return (
        self.findIndex((images) =>
          images.some(({ assetType }) => assetType === "MASTER_IMAGE")
        ) === index
      );
    }
  );

  return imageSets.map((images) => ({
    mainSource: _.result<string>(
      _.find(images, {
        format: "Product-Hero-Small-Desktop-Tablet"
      }),
      "url"
    ),
    thumbnail: _.result<string>(
      _.find(images, {
        format: "Product-Color-Selector-Mobile"
      }),
      "url"
    ),
    altText: images[0].name
  }));
};

export const getColourThumbnailUrl = (images): string =>
  _.result(
    _.find(images, { format: "Product-Color-Selector-Large-Desktop" }),
    "url"
  );

// Find attributes like surface finish, color, etc, from classifications
// TODO: Try to consolidate with the "unique" approach.
export const mapProductClassifications = (
  product: Product,
  classificationNamepace: string
) => {
  const allProducts: {
    [productCode: string]: Product;
  } = {
    [product.code]: product,
    ...product.variantOptions.reduce((allClassifications, variant) => {
      return {
        ...allClassifications,
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
    COLOUR_FAMILY: `${classificationNamepace}/appearanceAttributes.colourfamily`,
    LENGTH: `${classificationNamepace}/measurements.length`,
    WIDTH: `${classificationNamepace}/measurements.width`,
    HEIGHT: `${classificationNamepace}/measurements.height`
  };

  return Object.entries(allProducts).reduce((carry, [productCode, product]) => {
    (product.classifications || []).forEach((classification) => {
      const { code, features } = classification;

      const carryProp = (propName, value) => {
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
          value: valueFeature ? valueFeature.featureValues[0].value : "n/a"
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
            carry[productCode] = {
              ...carry[productCode],
              measurements: {
                ...(carry[productCode] ? carry[productCode].measurements : {}),
                [code.split(".").pop()]: {
                  name,
                  value: {
                    value: featureValues ? featureValues[0].value : 0,
                    // TODO: This isn't coming through
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

const getMeasurementKey = (measurements) => {
  const { length, width, height } = measurements;
  return [length, width, height]
    .filter(Boolean)
    .map((prop) => prop.value.value)
    .join("x");
};

export const getProductAttributes = (
  productClassifications,
  selfProduct,
  pageContext
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
    "colourfamily"
  );
  const allColours = getAllValues(
    productClassifications,
    "colourfamily"
  ).filter(Boolean);

  const selectedSize = getProductProp(
    productClassifications,
    selfProduct.code,
    "measurements"
  );

  const allSizes = getAllValues(productClassifications, "measurements").filter(
    Boolean
  );

  // The last attribute should be "quantity", but I can't find any products having it.
  const propHierarchy = ["colourfamily", "measurements", "???"];
  const getMasterProperty = (keys, hirarchy) =>
    hirarchy.filter((code) => keys.includes(code))[0];

  const getPropValue = (classification, propName) => {
    const prop = classification[propName];

    const propValueMap = {
      texturefamily: (prop) => prop.value.code,
      colourfamily: (prop) => prop.value.code,
      measurements: (prop) => getSizeLabel(prop)
    };

    return prop ? propValueMap[propName](prop) : undefined;
  };

  const findProductCode = (
    filter /*: { "texturefamily": string, "colourfamily": string, "measurements": string } */,
    property
  ) => {
    filter = {
      colourfamily: selectedColour ? selectedColour.value.code : undefined,
      texturefamily: selectedColour ? selectedColour.value.code : undefined,
      measurements: selectedSize ? getSizeLabel(selectedSize) : undefined,
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
          value: { code, value },
          thumbnailUrl
        } = color;

        const variantCode = findProductCode(
          {
            colourfamily: code
          },
          "colourfamily"
        );

        return {
          label: value,
          isSelected: selectedColour && code === selectedColour.value.code,
          thumbnail: thumbnailUrl,
          ...(variantCode
            ? {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: getProductUrl(pageContext.countryCode, variantCode)
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
                  to: getProductUrl(pageContext.countryCode, variantCode)
                }
              }
            : {})
        };
      })
    },
    {
      // TODO: There isn't such a thing as "Size" in the data.
      name: "Størrelse",
      type: "chips",
      variants: allSizes.map((size) => {
        const key = getSizeLabel(size);
        const variantCode = findProductCode(
          {
            measurements: key
          },
          "measurements"
        );

        return {
          label: key,
          isSelected: key === getSizeLabel(selectedSize),
          ...(variantCode
            ? {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: getProductUrl(pageContext.countryCode, variantCode)
                }
              }
            : {})
        };
      })
    }
  ];
};

export const getProductTechnicalSpecifications = (
  classificationNamespace: string,
  classifications
) => {
  // TODO: This is hardcoded for Norway.
  const TECHNICAL_SPECIFICATION_ORDER = [
    "measurements.length",
    "measurements.width",
    "measurements.height",
    "weightAttributes.netweight",
    "roofAttributes.minimumpitch",
    "pitchRoofAttributes.piecespersqm",
    "tilesAttributes.battendistance",
    "tilesAttributes.averagedeckwidth",
    "weightAttributes.weightpersqm"
  ].map((value) => `${classificationNamespace}/${value}`);

  return classifications
    .map(({ code, name, featureValues, featureUnit }) => ({
      name,
      value: `${featureValues[0].value} ${featureUnit?.symbol || ""}`,
      code
    }))
    .flat()
    .sort(({ code: a }, { code: b }) => {
      const aIndex = TECHNICAL_SPECIFICATION_ORDER.indexOf(a);
      const bIndex = TECHNICAL_SPECIFICATION_ORDER.indexOf(b);

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });
};
