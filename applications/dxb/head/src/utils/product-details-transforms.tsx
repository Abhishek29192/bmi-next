import { MediaData, ProductOverviewPaneProps } from "@bmi-digital/components";
import { Link } from "gatsby";
import React from "react";
import { isDefined } from "../../../libraries/utils/src";
import DefaultImage from "../images/DefaultImage.svg";
import { Image, Measurements, Product, RelatedVariant } from "../types/pim";
import { getPathWithCountryCode } from "./path";

// Returns an array of all the values of a certain prop
const getAllValues = (product: Product, propName: keyof RelatedVariant) => {
  const allValuesArray = [
    // eslint-disable-next-line security/detect-object-injection
    product[propName],
    ...(product.relatedVariants || []).map(
      // eslint-disable-next-line security/detect-object-injection
      (variant) => variant[propName]
    )
  ]
    .reduce((allValues, value) => {
      if (
        !allValues.find((v) => {
          if (propName === "measurements") {
            const valueAsMeasurement = value as Measurements;
            const vAsMeasurement = v as Measurements;
            if (
              vAsMeasurement &&
              valueAsMeasurement &&
              vAsMeasurement.label.length > 0 &&
              valueAsMeasurement.label.length > 0
            ) {
              return (
                valueAsMeasurement.length?.value ===
                  vAsMeasurement.length?.value &&
                valueAsMeasurement.width?.value ===
                  vAsMeasurement.width?.value &&
                valueAsMeasurement.length?.value ===
                  vAsMeasurement.length?.value &&
                valueAsMeasurement.thickness?.value ===
                  vAsMeasurement.thickness?.value &&
                valueAsMeasurement.volume?.value ===
                  vAsMeasurement.volume?.value
              );
            } else {
              return valueAsMeasurement.label.length > 0;
            }
          } else {
            return v === value;
          }
        })
      ) {
        if (propName === "measurements") {
          if ((value as Measurements)?.label?.length > 0) {
            allValues.push(value);
          }
        } else {
          if (value) {
            allValues.push(value);
          }
        }
      }
      return allValues;
    }, [])
    .filter(Boolean);

  return allValuesArray.sort((a, b) => {
    const isMeasurements = propName === "measurements";
    if (isMeasurements) {
      const heightValueA = a["height"]?.value || 0;
      const heightValueB = b["height"]?.value || 0;

      const widthValueA = a["width"]?.value || 0;
      const widthValueB = b["width"]?.value || 0;

      const lengthValueA = a["length"]?.value || 0;
      const lengthValueB = b["length"]?.value || 0;

      return (
        lengthValueA - lengthValueB ||
        heightValueA - heightValueB ||
        widthValueA - widthValueB
      );
    }
    return a < b ? -1 : 1;
  });
};

export const transformImages = (
  images: readonly Image[]
): readonly MediaData[] => {
  return images.map(({ mainSource, thumbnail, altText }) => ({
    media: React.createElement("img", {
      src: mainSource,
      alt: altText
    } as HTMLImageElement),
    thumbnail
  }));
};

export type Options = { size: string; variantAttribute: string };

const getPropValue = (
  variant: RelatedVariant,
  propName: keyof RelatedVariant
) => {
  // eslint-disable-next-line security/detect-object-injection
  const prop = variant[propName];

  return propName === "measurements" ? (prop as Measurements).label : prop;
};

type Filters = {
  colour?: string;
  colourFamily?: string;
  textureFamily?: string;
  measurements?: string;
  variantAttribute?: string;
};

type FilterKeys = keyof Filters;

// variantCodeToPathMap will be populated when
// GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE="false"
// for Norway, Finland, Italy and Group sites!
export const getProductAttributes = (
  product: Product,
  countryCode: string,
  options: Options,
  queryParams = "",
  variantCodeToPathMap: Record<string, string> | undefined = undefined // when this is provided then ``
): ProductOverviewPaneProps["attributes"] => {
  const selectedTextureFamily = product.textureFamily;
  const allTextureFamilies = selectedTextureFamily
    ? (getAllValues(product, "textureFamily") as string[])
    : [];

  const selectedColour = product.colour;
  const allColours = selectedColour
    ? (getAllValues(product, "colour") as string[])
    : [];

  const selectedSize = product.measurements;
  const allMeasurements = selectedSize
    ? (getAllValues(product, "measurements") as Measurements[])
    : [];

  const selectedVariantAttribute = product.variantAttribute;
  const allVariantAttributes = selectedVariantAttribute
    ? (getAllValues(product, "variantAttribute") as string[])
    : [];

  const propHierarchy: FilterKeys[] = [
    { propName: "colour" as const, values: allColours },
    { propName: "colourFamily" as const, values: allColours },
    { propName: "textureFamily" as const, values: allTextureFamilies },
    { propName: "measurements" as const, values: allMeasurements },
    {
      propName: "variantAttribute" as const,
      values: allVariantAttributes
    }
  ].reduce<FilterKeys[]>((carry, { propName, values }) => {
    if (values.length <= 0) return carry;
    return [...carry, propName];
  }, []);

  const getMasterProperty = (keys: string[]): FilterKeys =>
    propHierarchy.filter((propName) => keys.includes(propName))[0];

  const findVariant = (
    filter: Filters,
    property: "colour" | "textureFamily" | "measurements" | "variantAttribute"
  ): RelatedVariant | undefined => {
    const mergedFilter: Filters = {
      colour: selectedColour,
      textureFamily: selectedTextureFamily,
      measurements: selectedSize ? selectedSize.label : undefined,
      variantAttribute: selectedVariantAttribute,
      ...filter
    };

    const masterProperty = getMasterProperty(
      Object.entries(mergedFilter).reduce<string[]>(
        (carry, [propName, value]) => {
          if (!value) {
            return carry;
          }
          return [...carry, propName];
        },
        []
      )
    );

    const bestMatch = product.relatedVariants.reduce(
      (carry, variant) => {
        // The root prop must match
        if (
          getPropValue(variant, masterProperty) !==
          // eslint-disable-next-line security/detect-object-injection
          mergedFilter[masterProperty]
        ) {
          return carry;
        }

        const matches = Object.entries(mergedFilter).filter(([key, value]) => {
          if (
            !value ||
            propHierarchy.indexOf(key as keyof Filters) >
              propHierarchy.indexOf(property)
          ) {
            return false;
          }
          return getPropValue(variant, key as keyof Filters) === value;
        });
        if (carry.matches >= matches.length) {
          return carry;
        }

        return {
          matches: matches.length,
          variant: variant
        };
      },
      {
        matches: 0,
        variant: null
      }
    );

    if (!bestMatch.matches) {
      return;
    }
    if (bestMatch.matches < propHierarchy.indexOf(property)) {
      return;
    }

    return bestMatch.variant;
  };

  return [
    {
      name: product.colourMicrocopy,
      type: "thumbnails",
      variants: allColours.map((colour) => {
        const variant = findVariant(
          {
            colour
          },
          "colour"
        );
        const isSelected = selectedColour && colour === selectedColour;
        const path = !isSelected
          ? generateVariantPathWithQuery(
              variant,
              queryParams,
              countryCode,
              variantCodeToPathMap
            )
          : undefined;

        return {
          label: colour,
          isSelected,
          thumbnail:
            variant?.thumbnail || product?.masterImage?.thumbnail || null,
          media:
            !variant?.thumbnail && !product?.masterImage?.thumbnail ? (
              <DefaultImage />
            ) : null,
          ...(!isSelected &&
            allColours.length > 1 &&
            path && {
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
      name: product.textureFamilyMicrocopy,
      type: "chips",
      variants: allTextureFamilies.reduce((acc, textureFamily) => {
        const variant = findVariant(
          {
            textureFamily
          },
          "textureFamily"
        );
        const isSelected =
          selectedTextureFamily && textureFamily === selectedTextureFamily;

        if (!variant && !isSelected) {
          return acc;
        }

        const path = !isSelected
          ? generateVariantPathWithQuery(
              variant,
              queryParams,
              countryCode,
              variantCodeToPathMap
            )
          : undefined;

        return [
          ...acc,
          {
            label: textureFamily,
            isSelected,
            ...(!isSelected &&
              path &&
              allTextureFamilies.length > 1 && {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: path
                }
              })
          }
        ];
      }, [])
    },
    {
      name: options.size || "Size",
      type: "chips",
      variants: allMeasurements.reduce((acc, measurements) => {
        const key = measurements.label;
        const variant = findVariant(
          {
            measurements: key
          },
          "measurements"
        );
        const isSelected = key === selectedSize.label;
        if (!variant && !isSelected) {
          return acc;
        }

        const path = !isSelected
          ? generateVariantPathWithQuery(
              variant,
              queryParams,
              countryCode,
              variantCodeToPathMap
            )
          : undefined;

        return [
          ...acc,
          {
            label: measurements.label,
            isSelected,
            ...(!isSelected &&
              path &&
              allMeasurements.length > 1 && {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: path
                }
              })
          }
        ];
      }, [])
    },
    {
      name: options.variantAttribute,
      type: "chips",
      variants: allVariantAttributes.reduce((acc, variantAttribute) => {
        const variant = findVariant(
          {
            variantAttribute
          },
          "variantAttribute"
        );
        const isSelected =
          (selectedVariantAttribute &&
            selectedVariantAttribute === variantAttribute) ||
          false;

        if (!variant && !isSelected) {
          return acc;
        }

        const path = !isSelected
          ? generateVariantPathWithQuery(
              variant,
              queryParams,
              countryCode,
              variantCodeToPathMap
            )
          : undefined;

        return [
          ...acc,
          {
            label: variantAttribute,
            isSelected,
            ...(!isSelected &&
              path &&
              allVariantAttributes.length > 1 && {
                action: {
                  model: "routerLink",
                  linkComponent: Link,
                  to: path
                }
              })
          }
        ];
      }, [])
    }
  ];
};

// TODO: Is there not a function to get a render value of a classification?
// TODO: Move this into 'product.subTitle' field, just like Elastic search ??
export const mapClassificationValues = (
  product: Pick<Product, "colour" | "measurements" | "textureFamily">
) => {
  return [product.colour, product.textureFamily, product.measurements?.label]
    .filter(isDefined)
    .filter((item) => item.trim().length > 0)
    .join(", ");
};

const generateVariantPathWithQuery = (
  variant: RelatedVariant,
  queryParams: string,
  countryCode: string,
  variantCodeToPathMap?: Record<string, string> | null
) => {
  let variantPath = variantCodeToPathMap?.[variant.code] || variant.path;
  if (queryParams && queryParams.length > 0 && variantPath.indexOf("?") < 0) {
    variantPath = queryParams.startsWith("?")
      ? `${variantPath}${queryParams}`
      : `${variantPath}?${queryParams}`;
  }
  return getPathWithCountryCode(countryCode, variantPath);
};
