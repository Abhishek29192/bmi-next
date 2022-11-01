import { NavigationList } from "../navigation/Navigation";

const charWidthSm = 8;
const charWidthMd = 8;
const charWidthLg = 9;
const logoWidthSm = 70;
const logoWidthMd = 70;
const logoWidthLg = 90;
const buttonSpacingSm = 24;
const buttonSpacingMd = 40;
const buttonSpacingLg = 49;
const searchIconWidth = 48;
const containerPadding = 48;

export type HeaderSizes = ("small" | "medium" | "large")[];

type ElementWidths = {
  large: number;
  medium: number;
  small: number;
};

export const getElementWidths = (
  navigation: readonly NavigationList[]
): ElementWidths => {
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
};

export const getSize = (
  windowWidth: number,
  elementWidths: ElementWidths
): HeaderSizes => {
  if (windowWidth - elementWidths.small < 0) {
    return [];
  } else if (windowWidth - elementWidths.medium < 0) {
    return ["small"];
  } else if (windowWidth - elementWidths.large < 0) {
    return ["small", "medium"];
  }

  return ["small", "medium", "large"];
};
