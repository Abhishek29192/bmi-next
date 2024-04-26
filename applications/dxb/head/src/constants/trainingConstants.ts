import { CategoryType } from "@bmi/docebo-types";
import { MicroCopyValues, microCopy } from "@bmi/microcopies";

export const trainingCategoryMicroCopies: Record<
  CategoryType,
  MicroCopyValues
> = {
  Flat: microCopy.TRAINING_CATEGORY_FLAT,
  Pitched: microCopy.TRAINING_CATEGORY_PITCHED,
  Other: microCopy.TRAINING_CATEGORY_OTHER
};
