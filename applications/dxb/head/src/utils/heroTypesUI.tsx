import React from "react";
import { Hero } from "@bmi/components";
import { SpotlightHero } from "@bmi/components";
import { HeroItem } from "@bmi/components";

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
