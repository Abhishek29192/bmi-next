import { HeroProps } from "@bmi-digital/components/hero";
import { SpotlightHeroProps } from "@bmi-digital/components/spotlight-hero";
import { transformHyphens } from "@bmi-digital/components/utils";
import React from "react";
import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import { Data as ContentfulImageData } from "../components/image/types";
import { Data as VideoData } from "../components/video/types";
import ButtonLink from "../components/link/ButtonLink";
import { Data as LinkData } from "../components/link/types";
import createImageProps from "../components/image/createImageProps";
import createVideoProps from "../components/video/createVideoProps";

type LevelMap = {
  [key: string]: 1 | 2 | 3;
};
const levelMap: LevelMap = {
  "Level 1": 1,
  "Level 2": 2,
  "Level 3": 3
};

export const generateHeroLevel = (
  heroType: string | null,
  enhancedBreadcrumbs: BreadcrumbsData
): 1 | 2 | 3 | undefined => {
  if (!heroType) {
    return;
  }
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    return (Math.min(
      enhancedBreadcrumbs.filter(({ slug }) => slug).length,
      3
    ) || 1) as 1 | 2 | 3;
  }
  // eslint-disable-next-line security/detect-object-injection
  return levelMap[heroType];
};

export const generateHeroProps = (
  title: string,
  level: 1 | 2 | 3 | undefined,
  subtitle: string | null,
  featuredVideo: VideoData | null,
  featuredMedia: ContentfulImageData | null,
  cta: LinkData | null
): HeroProps | SpotlightHeroProps => {
  return {
    title: transformHyphens(title),
    level,
    children: subtitle,
    media: featuredVideo
      ? createVideoProps(featuredVideo)
      : featuredMedia
        ? createImageProps({
            ...featuredMedia,
            size: "cover",
            loading: "eager"
          })
        : undefined,
    cta: cta ? <ButtonLink data={cta}>{cta.label}</ButtonLink> : undefined
  };
};
