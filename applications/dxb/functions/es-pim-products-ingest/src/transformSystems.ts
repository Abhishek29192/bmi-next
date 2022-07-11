import logger from "@bmi-digital/functions-logger";
import type { System as EsSystem } from "@bmi/elasticsearch-types";
import type { System as PimSystem } from "@bmi/pim-types";
import { generateHashFromString, generateUrl } from "@bmi/utils";

const getBrandCode = (
  categories: PimSystem["categories"]
): string | undefined => {
  return categories.find(({ categoryType }) => {
    return categoryType === "Brand";
  })?.code;
};

export const transformSystem = (system: PimSystem): EsSystem => {
  const { approvalStatus, type, images, code, name, shortDescription } = system;
  const brand = getBrandCode(system.categories);
  const hashedCode = generateHashFromString(code);
  const path = `/s/${generateUrl([code, name, hashedCode])}`;
  logger.info({
    message: `System brand: ${brand}`
  });
  return {
    approvalStatus,
    brand,
    code,
    images,
    name,
    shortDescription,
    type,
    hashedCode,
    path
  };
};
