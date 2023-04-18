import { Filter } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";
import React from "react";
import ColorSwatch, { COLOR_CODES } from "../components/ColorSwatch";

type colourCodes = keyof typeof COLOR_CODES;

export const FilterMainFlexWrapper = styled("div")(() => ({
  display: "flex"
}));

export const enhanceColourFilterWithSwatches = (filter: Filter): Filter => {
  return {
    ...filter,
    options: filter.options.map((option) => ({
      ...option,
      label: (
        <FilterMainFlexWrapper>
          <ColorSwatch colorCode={option.value as colourCodes} />
          {option.label}
        </FilterMainFlexWrapper>
      )
    }))
  };
};
