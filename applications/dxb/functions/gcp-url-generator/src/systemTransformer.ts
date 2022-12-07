import { System as PimSystem } from "@bmi/pim-types";
import { generateHashFromString, generateUrl } from "@bmi/utils";

import { GeneratedObjectWithUrl } from "./types";

export const transformSystem = (
  system: PimSystem
): GeneratedObjectWithUrl[] => {
  if (system.approvalStatus !== "approved") {
    return [];
  }
  const hashedCode = generateHashFromString(system.code);
  const name = system.name;
  return [
    {
      variantCode: system.code,
      catalog: process.env.PIM_CATALOG_NAME,
      url: `/s/${generateUrl([name, hashedCode])}`
    }
  ];
};
