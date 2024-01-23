import type { CategoryType } from "@bmi/docebo-types";
import type { TrainingDetailsCardProps } from "@bmi-digital/components";

const getCategoryType = (
  categoryType: CategoryType
): TrainingDetailsCardProps["category"]["type"] => {
  switch (categoryType) {
    case "Pitched":
      return "pitched";
    case "Flat":
      return "flat";
    case "Other":
      return "other";
  }
};

export default getCategoryType;
