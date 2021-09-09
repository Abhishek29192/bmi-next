import type { System } from "./pim";
// Can't use lodash pick as it's not type-safe
const pick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  const ret = {} as Pick<T, K>;
  keys.forEach((key) => (ret[key] = obj[key]));
  return ret;
};

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
  return categories.find(({ categoryType, parentCategoryCode }) => {
    return categoryType === "Brand" || parentCategoryCode === "BMI_Brands";
  })?.code;
};

export const transformSystem = (system: System): EsSystem => {
  const brand = getBrandCode(system.categories);
  return {
    ...pick(
      system,
      "approvalStatus",
      "type",
      "images",
      "code",
      "name",
      "shortDescription"
    ),
    brand
  };
};
