import React from "react";
import { CategoryType } from "@bmi/docebo-types";
import FlatRoof from "@bmi-digital/components/icon/FlatRoof";
import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import PitchedRoof from "@bmi-digital/components/icon/PitchedRoof";
import type { SvgIconProps } from "@mui/material/SvgIcon";

export const trainingCategoriesIcon: {
  [key in CategoryType]: React.FC<SvgIconProps>;
} = {
  Pitched: (props) => (
    <PitchedRoof {...props} data-testid="pitched-training-category-icon" />
  ),
  Flat: (props) => (
    <FlatRoof {...props} data-testid="flat-training-category-icon" />
  ),
  Other: (props) => (
    <OtherTraining {...props} data-testid="other-training-category-icon" />
  )
};
