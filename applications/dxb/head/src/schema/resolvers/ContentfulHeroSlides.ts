import resolvePromo from "./ContentfulPromo";
import { ContentfulPromo } from "./types/Promo";
import { ContentfulPageInfoCardData } from "./types/PageInfoCardData";
import resolvePageInfoCardData from "./ContentfulInfoCardData";
import type { Data as SlideData } from "../../components/Promo";
import type { Data as PageInfoData } from "../../components/PageInfo";

export type ContentfulHeroSlides = (
  | ContentfulPromo
  | ContentfulPageInfoCardData
)[];

const resolveHeroSlides = async (
  slides: ContentfulHeroSlides
): Promise<(SlideData | PageInfoData)[]> => {
  const promises = slides.map(async (slide) => {
    if (slide.__typename === "Promo") {
      return resolvePromo(slide);
    }

    return resolvePageInfoCardData(slide);
  });

  return Promise.all(promises);
};

export default resolveHeroSlides;
