import { CarouselHeroItem } from "@bmi-digital/components/carousel-hero";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import { Context as SiteContext } from "../../components/Site";
import ButtonLink from "../../components/link/ButtonLink";
import { DataTypeEnum } from "../../components/link/types";
import createImageProps from "../../components/image/createImageProps";
import createVideoProps from "../../components/video/createVideoProps";
import type { Data as LinkData } from "../../components/link/types";
import type { HomepageData } from "../home-page";

export const getHeroItemsWithContext = (
  { getMicroCopy }: SiteContext,
  slides: HomepageData["slides"]
): readonly CarouselHeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }, index) => {
      const hasPath = "path" in rest && !!rest.path;

      const callToAction =
        rest.__typename === "ContentfulPromo" && rest.cta ? (
          <ButtonLink data={rest.cta} hasBrandColours>
            {rest.cta?.label}
          </ButtonLink>
        ) : (
          <ButtonLink
            data={
              {
                type: DataTypeEnum.Internal,
                linkedPage: { path: hasPath ? rest.path : undefined }
              } as LinkData
            }
            hasBrandColours
          >
            {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
          </ButtonLink>
        );

      return {
        title,
        children: subtitle,
        hasUnderline: true,
        media: featuredVideo
          ? createVideoProps({ ...featuredVideo, "data-testid": "hero-video" })
          : featuredMedia
            ? createImageProps({
                ...featuredMedia,
                size: "cover",
                "data-testid": "hero-image",
                loading: index === 0 ? "eager" : "lazy"
              })
            : undefined,
        cta: rest["cta"] || hasPath ? callToAction : undefined
      };
    }
  );
};
