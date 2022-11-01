import { Hero, HeroItem, SpotlightHero } from "@bmi-digital/components";
import React from "react";

type heroLevelType = 1 | 2 | 3;
export const renderHero = (
  heroProps: HeroItem,
  breadcrumbsNode: React.ReactNode,
  heroLevel: heroLevelType,
  heroType: string,
  heroKeyLine?: {
    isHeroKeyLine?: boolean;
    isSpotlightHeroKeyLine?: boolean;
  }
) => {
  return heroType === "Spotlight" ? (
    <SpotlightHero
      {...heroProps}
      breadcrumbs={breadcrumbsNode}
      isHeroKeyLine={heroKeyLine.isSpotlightHeroKeyLine}
    />
  ) : (
    <Hero
      level={heroLevel}
      {...heroProps}
      breadcrumbs={breadcrumbsNode}
      isHeroKeyLine={heroKeyLine.isHeroKeyLine}
    />
  );
};
