import {
  Button,
  HeroProps,
  SpotlightHeroProps,
  transformHyphens
} from "@bmi-digital/components";
import React from "react";
import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import { Data as ContentfulImageData, renderImage } from "../components/Image";
import Link, { Data as LinkData } from "../components/Link";
import { Data as VideoData, renderVideo } from "../components/Video";

export const generateHeroLevel = (
  heroType: string,
  enhancedBreadcrumbs: BreadcrumbsData
): 1 | 2 | 3 => {
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    return (Math.min(
      enhancedBreadcrumbs.filter(({ slug }) => slug).length,
      3
    ) || 1) as 1 | 2 | 3;
  }
  const levelMap = {
    "Level 1": 1,
    "Level 2": 2,
    "Level 3": 3
  };
  // eslint-disable-next-line security/detect-object-injection
  return levelMap[heroType];
};

export const generateHeroProps = (
  title: string,
  level: 1 | 2 | 3,
  subtitle: string,
  featuredVideo: VideoData,
  featuredMedia: ContentfulImageData,
  cta: LinkData
): HeroProps | SpotlightHeroProps => {
  return {
    title: transformHyphens(title),
    level,
    children: subtitle,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
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
