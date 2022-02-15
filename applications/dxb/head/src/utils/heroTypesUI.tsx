import React from "react";
import { Hero } from "@bmi-digital/components";
import { SpotlightHero } from "@bmi-digital/components";
import { HeroItem } from "@bmi-digital/components";

type heroLevelType = 1 | 2 | 3;
export const renderHero = (
  heroProps: HeroItem,
  breadcrumbsNode: React.ReactNode,
  heroLevel: heroLevelType,
  brandLogo: string,
  heroType: string
) => {
  return heroType === "Spotlight" ? (
    <SpotlightHero
      {...heroProps}
      breadcrumbs={breadcrumbsNode}
      brand={brandLogo}
    />
  ) : (
    <Hero
      level={heroLevel}
      {...heroProps}
      breadcrumbs={breadcrumbsNode}
      brand={brandLogo}
    />
  );
};
