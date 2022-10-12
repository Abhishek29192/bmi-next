import { Button, HeroItem } from "@bmi/components";
import React from "react";
import { renderImage } from "../../components/Image";
import Link from "../../components/Link";
import { renderVideo } from "../../components/Video";
import { microCopy } from "../../constants/microCopies";
import type { HomepageData } from "../home-page";

export const getHeroItemsWithContext = (
  { getMicroCopy },
  slides: HomepageData["slides"]
): HeroItem[] => {
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
        media: featuredVideo
          ? renderVideo(featuredVideo)
          : renderImage(featuredMedia, { size: "cover" }),
        cta: rest["cta"] || rest["path"] ? callToAction : null
      };
    }
  );
};
