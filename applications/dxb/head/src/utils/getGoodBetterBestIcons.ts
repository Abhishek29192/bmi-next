import { GoodBetterBest } from "@bmi/pim-types";
import { Data as ResourcesType } from "../components/Resources";
import { GoodBetterBestIconsConfig } from "../types/GoodBetterBest";

export const getGoodBetterBestIcons = (
  resources: ResourcesType | null
): GoodBetterBestIconsConfig => ({
  [GoodBetterBest.good]: resources?.gbbGoodIndicator || "Thumb Up",
  [GoodBetterBest.better]: resources?.gbbBetterIndicator || "Heart",
  [GoodBetterBest.best]: resources?.gbbBestIndicator || "Star"
});
