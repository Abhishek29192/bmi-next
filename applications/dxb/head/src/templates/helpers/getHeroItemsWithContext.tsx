import { Button, CarouselHeroItem } from "@bmi-digital/components";
import React from "react";
import Image from "../../components/Image";
import Link from "../../components/Link";
import { renderVideo } from "../../components/Video";
import { microCopy } from "../../constants/microCopies";
import type { HomepageData } from "../home-page";

export const getHeroItemsWithContext = (
  { getMicroCopy },
  slides: HomepageData["slides"]
): CarouselHeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }) => {
      const callToAction =
        rest.__typename === "ContentfulPromo" && rest.cta ? (
          <Link component={Button} data={rest.cta}>
            {rest.cta?.label}
          </Link>
        ) : (
          <Link
            component={Button}
            data={{ linkedPage: { path: rest["path"] } }}
          >
            {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
          </Link>
        );

      return {
        title,
        children: subtitle,
        media: featuredVideo ? (
          renderVideo(featuredVideo)
        ) : (
          <Image data={featuredMedia} size="cover" />
        ),
        cta: rest["cta"] || rest["path"] ? callToAction : null
      };
    }
  );
};
