import { Filter } from "@bmi-digital/components";
import React from "react";
import ColorSwatch, { COLOR_CODES } from "../components/ColorSwatch";

type colourCodes = keyof typeof COLOR_CODES;

export const enhanceColourFilterWithSwatches = (filter: Filter): Filter => {
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
