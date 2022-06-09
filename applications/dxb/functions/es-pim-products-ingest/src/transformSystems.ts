import type { System } from "@bmi/pim-types";
import logger from "@bmi-digital/functions-logger";

export type EsSystem = {
  approvalStatus: System["approvalStatus"];
  brand?: string;
  type: System["type"];
  images: System["images"];
  code: System["code"];
  name: System["name"];
  shortDescription: System["shortDescription"];
};

const getBrandCode = (categories: System["categories"]): string | undefined => {
  return categories.find(({ categoryType }) => {
    return categoryType === "Brand";
  })?.code;
};

export const transformSystem = (system: System): EsSystem => {
  const { approvalStatus, type, images, code, name, shortDescription } = system;
  const brand = getBrandCode(system.categories);
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
    type
  };
};
