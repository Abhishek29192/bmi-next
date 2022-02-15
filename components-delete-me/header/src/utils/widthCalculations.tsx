import { NavigationList } from "@bmi-digital/components";
import styles from "../Header.module.scss";

const charWidthSm = parseInt(styles["char-width-sm"]!);
const charWidthMd = parseInt(styles["char-width-md"]!);
const charWidthLg = parseInt(styles["char-width-lg"]!);
const logoWidthSm = parseInt(styles["logo-width-sm"]!);
const logoWidthMd = parseInt(styles["logo-width-md"]!);
const logoWidthLg = parseInt(styles["logo-width-lg"]!);
const buttonSpacingSm = parseInt(styles["button-spacing-sm"]!);
const buttonSpacingMd = parseInt(styles["button-spacing-md"]!);
const buttonSpacingLg = parseInt(styles["button-spacing-lg"]!);
const searchIconWidth = parseInt(styles["search-icon-width"]!);
const containerPadding = parseInt(styles["container-padding"]!);

export type HeaderSizes = ("small" | "medium" | "large")[];

type ElementWidths = {
  large: number;
  medium: number;
  small: number;
};

export function getElementWidths(
  navigation: readonly NavigationList[]
): ElementWidths {
  return navigation.reduce(
    (carry, { label }) => ({
      large: carry.large + buttonSpacingLg + label.length * charWidthLg,
      medium: carry.medium + buttonSpacingMd + label.length * charWidthMd,
      small: carry.small + buttonSpacingSm + label.length * charWidthSm
    }),
    {
      large: containerPadding + logoWidthLg + searchIconWidth,
      medium: containerPadding + logoWidthMd + searchIconWidth,
      small: containerPadding + logoWidthSm + searchIconWidth
    }
  );
}

export function getSize(
  windowWidth: number,
  elementWidths: ElementWidths
): HeaderSizes {
  if (windowWidth - elementWidths.small < 0) {
    return [];
  } else if (windowWidth - elementWidths.medium < 0) {
    return ["small"];
  } else if (windowWidth - elementWidths.large < 0) {
    return ["small", "medium"];
  }

  return ["small", "medium", "large"];
}
