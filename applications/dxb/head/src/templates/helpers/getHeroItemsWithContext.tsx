import { Button, CarouselHeroItem } from "@bmi-digital/components";
import React from "react";
import { microCopy } from "@bmi/microcopies";
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
          <Link component={Button} data={rest.cta}>
            {rest.cta?.label}
          </Link>
        ) : (
          <Link
            component={Button}
            data={{
              linkedPage: { path: hasPath ? rest.path : undefined }
            }}
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
