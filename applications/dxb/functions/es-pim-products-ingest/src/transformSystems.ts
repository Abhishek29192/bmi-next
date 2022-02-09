import type { System } from "@bmi/pim-types";

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
