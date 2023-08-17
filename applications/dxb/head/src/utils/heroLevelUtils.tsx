import {
  Button,
  HeroProps,
  SpotlightHeroProps,
  transformHyphens
} from "@bmi-digital/components";
import React from "react";
import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import Image, { Data as ContentfulImageData } from "../components/Image";
import Link, { Data as LinkData } from "../components/Link";
import Video, { Data as VideoData } from "../components/Video";

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
  cta?: LinkData
): HeroProps | SpotlightHeroProps => {
  return {
    title: transformHyphens(title),
    level,
    children: subtitle,
    media: featuredVideo ? (
      <Video {...featuredVideo} />
    ) : featuredMedia ? (
      <Image {...featuredMedia} size="cover" />
    ) : undefined,
    cta:
      cta &&
      React.createElement(
        Link,
        {
          component: Button,
          data: cta
        },
        cta.label
      )
  };
};
