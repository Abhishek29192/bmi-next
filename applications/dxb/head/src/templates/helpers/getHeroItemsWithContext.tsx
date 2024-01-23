import { CarouselHeroItem } from "@bmi-digital/components/carousel-hero";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import Image from "../../components/Image";
import { Context as SiteContext } from "../../components/Site";
import Video from "../../components/Video";
import ButtonLink from "../../components/link/ButtonLink";
import { DataTypeEnum } from "../../components/link/types";
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
        media: featuredVideo ? (
          <Video {...featuredVideo} data-testid={"hero-video"} />
        ) : featuredMedia ? (
          <Image
            {...featuredMedia}
            size="cover"
            data-testid={"hero-image"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ) : undefined,
        cta: rest["cta"] || hasPath ? callToAction : undefined
      };
    }
  );
};
