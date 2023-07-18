import logger from "@bmi-digital/functions-logger";
import { generateHashFromString, generateUrl } from "@bmi/utils";
import type {
  Image as EsImage,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import type {
  Category as PimCategory,
  Classification as PimClassification,
  Image as PimImage,
  ImageAssetType as PimImageAssetType,
  System as PimSystem
} from "@bmi/pim-types";

const getBrand = (
  categories: PimSystem["categories"]
): PimCategory | undefined => {
  return categories?.find(({ categoryType }) => {
    return categoryType === "Brand";
  });
};

const groupImages = (images: readonly PimImage[]): PimImage[][] =>
  Object.values(groupByContainerId(images));

const groupByContainerId = (
  arr: readonly PimImage[]
): { [key: string]: PimImage[] } => {
  return arr.reduce(
    (acc: { [key: string]: PimImage[] }, currentValue: PimImage) => {
      if (!acc[currentValue["containerId"]]) {
        acc[currentValue["containerId"]] = [];
      }
      acc[currentValue["containerId"]].push(currentValue);
      return acc;
    },
    {}
  );
};

const mapImages = (
  groupedImages: readonly PimImage[][],
  assetType: PimImageAssetType
): EsImage[] => {
  return groupedImages
    .map((images) => {
      let mainSource;
      let thumbnail;
      let altText;
      images.forEach((image) => {
        if (
          image.assetType === assetType &&
          image.format === "Product-Hero-Small-Desktop-Tablet"
        ) {
          mainSource = image.url;
          return;
        }
        if (
          image.assetType === assetType &&
          image.format === "Product-Color-Selector-Mobile"
        ) {
          thumbnail = image.url;
          return;
        }
        if (image.assetType === assetType && !image.format) {
          altText = image.name;
          return;
        }
      });
      return {
        mainSource,
        thumbnail,
        altText
      };
    })
    .filter((image) => image.mainSource || image.thumbnail);
};

const getScoringWeight = (classifications?: readonly PimClassification[]) =>
  Number.parseInt(
    classifications
      ?.find((classification) =>
        classification.features?.some(
          (feature) =>
            // TODO: Remove upercase checks - DXB-3449
            feature.code.split("/").pop()!.toUpperCase() ===
            "scoringWeightAttributes.scoringweight".toUpperCase()
        )
      )
      ?.features?.find(
        (feature) =>
          // TODO: Remove upercase checks - DXB-3449
          feature.code.split("/").pop()!.toUpperCase() ===
          "scoringWeightAttributes.scoringweight".toUpperCase()
      )?.featureValues[0].value || "0"
  );

const getSystemAttributes = (
  classifications?: readonly PimClassification[]
) => {
  if (classifications === undefined || classifications.length === 0) {
    return undefined;
  }

  const sytemAttributes = classifications.find(
    (classification) => classification.code === "systemAttributes"
  );

  if (sytemAttributes === undefined) {
    return undefined;
  }

  const { features } = sytemAttributes;

  return features === undefined
    ? []
    : features.map(({ code, featureValues, name }) => ({
        code,
        name,
        values: featureValues.map(({ value }) => value)
      }));
};

export const transformSystem = (system: PimSystem): EsSystem | undefined => {
  const {
    approvalStatus,
    type,
    code,
    name,
    shortDescription,
    classifications
  } = system;
  if (!name || approvalStatus !== "approved") {
    return undefined;
  }
  const brand = getBrand(system.categories);
  const hashedCode = generateHashFromString(code);
  const groupedImages = groupImages(system.images || []);
  const path = `/s/${generateUrl([name, hashedCode])}`;
  const scoringWeight = getScoringWeight(classifications);
  const systemAttributes = getSystemAttributes(classifications);
  logger.info({
    message: `System brand: ${brand}`
  });

  logger.info({
    message: `System attributes: ${systemAttributes} and System Classifications:${classifications}`
  });

  const transformedSystem = {
    approvalStatus,
    brand,
    code,
    hashedCode,
    masterImage: mapImages(groupedImages, "MASTER_IMAGE")?.[0],
    galleryImages: mapImages(groupedImages, "GALLERY"),
    name,
    path,
    scoringWeight,
    ...(systemAttributes && {
      systemAttributes
    }),
    shortDescription,
    type
  };

  logger.info({
    message: `Transformed System: ${transformedSystem}`
  });

  return transformedSystem;
};
