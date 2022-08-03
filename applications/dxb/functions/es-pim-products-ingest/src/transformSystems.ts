import logger from "@bmi-digital/functions-logger";
import type {
  Image as EsImage,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import type {
  Category as PimCategory,
  Classification as PimClassification,
  Image as PimImage,
  System as PimSystem
} from "@bmi/pim-types";
import { generateHashFromString, generateUrl } from "@bmi/utils";

const getBrand = (
  categories: PimSystem["categories"]
): PimCategory | undefined => {
  return categories?.find(({ categoryType }) => {
    return categoryType === "Brand";
  });
};

const getImages = (images: readonly PimImage[]): EsImage[] =>
  images.map((image) => ({ mainSource: "", thumbnail: "", altText: "" }));

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

export const transformSystem = (system: PimSystem): EsSystem => {
  const { approvalStatus, type, code, name, shortDescription } = system;
  const brand = getBrand(system.categories);
  const hashedCode = generateHashFromString(code);
  const images = getImages(system.images || []);
  const path = `/s/${generateUrl([name, hashedCode])}`;
  const scoringWeight = getScoringWeight(system.classifications);
  logger.info({
    message: `System brand: ${brand}`
  });
  return {
    approvalStatus,
    brand,
    code,
    hashedCode,
    images,
    name,
    path,
    scoringWeight,
    shortDescription,
    type
  };
};
