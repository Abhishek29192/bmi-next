import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import { GoodBetterBest } from "@bmi/pim-types";
import type { IconLevel } from "@bmi-digital/components/tag";

export const goodBetterBestLabels: Record<GoodBetterBest, MicroCopyValues> = {
  [GoodBetterBest.good]: microCopy.GOOD_BETTER_BEST_LABEL_GOOD,
  [GoodBetterBest.better]: microCopy.GOOD_BETTER_BEST_LABEL_BETTER,
  [GoodBetterBest.best]: microCopy.GOOD_BETTER_BEST_LABEL_BEST
};

export const getLevel = (goodBetterBest: GoodBetterBest): IconLevel => {
  switch (goodBetterBest) {
    case GoodBetterBest.good:
      return "good";
    case GoodBetterBest.better:
      return "better";
    case GoodBetterBest.best:
      return "best";
  }
};
