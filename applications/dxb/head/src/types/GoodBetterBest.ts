export type GoodBetterBestIcons = "Thumb Up" | "Heart" | "Star";
import { GoodBetterBest } from "@bmi/pim-types";

export type GoodBetterBestIconsConfig = {
  [GoodBetterBest.good]: GoodBetterBestIcons;
  [GoodBetterBest.better]: GoodBetterBestIcons;
  [GoodBetterBest.best]: GoodBetterBestIcons;
};
