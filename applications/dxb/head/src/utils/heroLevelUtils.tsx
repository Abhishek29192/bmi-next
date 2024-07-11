import { transformHyphens } from "@bmi-digital/components/utils";
import React from "react";
import ButtonLink from "../components/link/ButtonLink";
import createVideoProps from "../components/video/createVideoProps";
import createContentfulImageProps from "../components/image/contentful-image/createContentfulImageProps";
import type { SpotlightHeroProps } from "@bmi-digital/components/spotlight-hero";
import type { HeroProps } from "@bmi-digital/components/hero";
import type { Data as ContentfulImageData } from "../components/image/contentful-image/types";
import type { ImageWidths } from "../components/image/types";
import type { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import type { Data as LinkData } from "../components/link/types";
import type { Data as VideoData } from "../components/video/types";

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

const mediaWidths: ImageWidths = [593, 713, 408, 708, 988];

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
      ? createVideoProps({
          ...featuredVideo,
          previewMediaWidths: mediaWidths
        })
      : featuredMedia
        ? createContentfulImageProps({
            ...featuredMedia,
            size: "cover",
            loading: "eager",
            widths: mediaWidths
          })
        : undefined,
    cta: cta ? <ButtonLink data={cta}>{cta.label}</ButtonLink> : undefined
  };
};
