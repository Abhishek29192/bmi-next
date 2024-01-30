import Hero, { HeroProps } from "@bmi-digital/components/hero";
import SpotlightHero, {
  SpotlightHeroProps
} from "@bmi-digital/components/spotlight-hero";
import React from "react";

export const renderHero = (
  heroProps: HeroProps | SpotlightHeroProps,
  breadcrumbsNode: React.ReactNode,
  heroType: string | null,
  heroKeyLine?: {
    isHeroKeyLine?: boolean;
    isSpotlightHeroKeyLine?: boolean;
  }
) => {
  return heroType === "Spotlight" ? (
    <SpotlightHero
      {...(heroProps as SpotlightHeroProps)}
      breadcrumbs={breadcrumbsNode}
      isHeroKeyLine={heroKeyLine?.isSpotlightHeroKeyLine}
    />
  ) : (
    <Hero
      {...(heroProps as HeroProps)}
      breadcrumbs={breadcrumbsNode}
      isHeroKeyLine={heroKeyLine?.isHeroKeyLine}
    />
  );
};
