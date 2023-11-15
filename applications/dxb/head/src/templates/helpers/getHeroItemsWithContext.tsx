import Button from "@bmi-digital/components/button";
import { CarouselHeroItem } from "@bmi-digital/components/carousel-hero";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import Image from "../../components/Image";
import Link from "../../components/Link";
import { Context as SiteContext } from "../../components/Site";
import Video from "../../components/Video";
import type { HomepageData } from "../home-page";

export const getHeroItemsWithContext = (
  { getMicroCopy }: SiteContext,
  slides: HomepageData["slides"]
): readonly CarouselHeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }) => {
      const hasPath = "path" in rest && !!rest.path;

      const callToAction =
        rest.__typename === "ContentfulPromo" && rest.cta ? (
          <Link component={Button} data={rest.cta} hasBrandColours>
            {rest.cta?.label}
          </Link>
        ) : (
          <Link
            component={Button}
            data={{
              linkedPage: { path: hasPath ? rest.path : undefined }
            }}
            hasBrandColours
          >
            {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
          </Link>
        );

      return {
        title,
        children: subtitle,
        hasUnderline: true,
        media: featuredVideo ? (
          <Video {...featuredVideo} data-testid={"hero-video"} />
        ) : featuredMedia ? (
          <Image {...featuredMedia} size="cover" data-testid={"hero-image"} />
        ) : undefined,
        cta: rest["cta"] || hasPath ? callToAction : null
      };
    }
  );
};
