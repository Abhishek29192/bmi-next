import { Card as OverlapCardType } from "../../components/OverlapCards";
import { resolvePath, getUrlFromPath } from "./utils/path";
import resolveVideo from "./ContentfulVideo";
import resolveImage from "./ContentfulImage";
import type { ContentfulBrand, ContentfulOverlapCard } from "./types/HomePage";
import type { Data as BrandData } from "../../components/Brands";

export const resolveBrands = async (
  brands: ContentfulBrand[]
): Promise<BrandData[]> => {
  const promises = brands.map(
    async ({ title, slug, sys, parentPage, brandLogo, subtitle }) => {
      const path = await resolvePath({ title, slug, sys, parentPage });

      return {
        brandLogo,
        path: getUrlFromPath(path),
        subtitle,
        title
      };
    }
  );

  return Promise.all(promises);
};

export const resolveOverlapCards = async (
  overlapCards: [
    ContentfulOverlapCard,
    ContentfulOverlapCard,
    ...ContentfulOverlapCard[]
  ]
): Promise<OverlapCardType[]> => {
  const promises = overlapCards.map(
    async ({ title, slug, sys, parentPage, featuredVideo, featuredMedia }) => {
      const path = await resolvePath({ title, slug, sys, parentPage });
      return {
        title,
        featuredMedia: featuredMedia ? resolveImage(featuredMedia) : null,
        featuredVideo: featuredVideo ? await resolveVideo(featuredVideo) : null,
        path: getUrlFromPath(path)
      };
    }
  );

  return Promise.all(promises);
};
