/* eslint-disable security/detect-object-injection */
import React from "react";
import { GoodBetterBest } from "@bmi/pim-types";
import { microCopy, MicroCopyValues } from "../constants/microCopies";
import { GoodBetterBestIcons } from "../types/GoodBetterBest";
import {
  IndicatorWrapper,
  StyledIcon,
  StyledTypography,
  classes
} from "./styles/GoodBetterBestIndicatorStyles";
import { useSiteContext } from "./Site";
import { IconName } from "./Icon";

type Props = {
  indicatorType?: GoodBetterBest;
};

const iconsMap: Record<GoodBetterBestIcons, IconName> = {
  Heart: "Heart",
  Star: "Star",
  "Thumb Up": "ThumbUp"
};

const labelsMap: Record<GoodBetterBest, MicroCopyValues> = {
  [GoodBetterBest.good]: microCopy.GOOD_BETTER_BEST_LABEL_GOOD,
  [GoodBetterBest.better]: microCopy.GOOD_BETTER_BEST_LABEL_BETTER,
  [GoodBetterBest.best]: microCopy.GOOD_BETTER_BEST_LABEL_BEST
};

const GoodBetterBestIndicator = ({ indicatorType }: Props) => {
  const { getMicroCopy, goodBetterBestIconsConfig } = useSiteContext();

  if (!indicatorType) {
    return null;
  }

  return (
    <IndicatorWrapper
      className={classes[indicatorType.toLowerCase()]}
      data-testid={`goodBetterBest-indicator-${indicatorType}`}
    >
      <StyledIcon
        name={iconsMap[goodBetterBestIconsConfig[indicatorType]]}
        data-testid={`goodBetterBest-icon-${indicatorType.toLowerCase()}`}
      />
      <StyledTypography>
        {getMicroCopy(labelsMap[indicatorType])}
      </StyledTypography>
    </IndicatorWrapper>
  );
};

export default GoodBetterBestIndicator;
