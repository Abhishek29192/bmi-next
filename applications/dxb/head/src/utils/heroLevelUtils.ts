import { Button, HeroItem, transformHyphens } from "@bmi-digital/components";
import React from "react";
import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import { Data as ImageData, renderImage } from "../components/Image";
import Link, { Data as LinkData } from "../components/Link";
import { Data as VideoData, renderVideo } from "../components/Video";

export const generateHeroLevel = (
  heroType: string,
  enhancedBreadcrumbs: BreadcrumbsData
) => {
  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(
      enhancedBreadcrumbs.filter(({ slug }) => slug).length,
      3
    ) || 1) as 1 | 2 | 3;
  } else {
    const levelMap = {
      "Level 1": 1,
      "Level 2": 2,
      "Level 3": 3
    };
    // eslint-disable-next-line security/detect-object-injection
    heroLevel = levelMap[heroType] as 1 | 2 | 3;
  }
  return heroLevel;
};

export const generateHeroProps = (
  title: string,
  subtitle: string,
  featuredVideo: VideoData,
  featuredMedia: ImageData,
  cta: LinkData
): HeroItem => {
  return {
    title: transformHyphens(title),
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
