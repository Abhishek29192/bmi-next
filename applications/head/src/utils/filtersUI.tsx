import React from "react";
import ColorSwatch, { COLOR_CODES } from "../components/ColorSwatch";
import { ProductFilter } from "./filters";

type colourCodes = keyof typeof COLOR_CODES;

export const enhanceColourFilterWithSwatches = (filter: ProductFilter) => {
  return {
    ...filter,
    options: filter.options.map((option) => ({
      ...option,
      label: (
        <>
          <ColorSwatch colorCode={option.value as colourCodes} />
          {option.label}
        </>
      )
    }))
  };
};
