import type { Data as CarouselSectionData } from "../../../components/carousel-section/CarouselSection";
import type { ContentfulLink } from "./Link";
import type { ContentfulPromo } from "./Promo";
import type { ContentfulPageInfoCardData } from "./PageInfoCardData";

export type ContentfulCarouselSection = Omit<
  CarouselSectionData,
  "slides" | "link"
> & {
  link: ContentfulLink | null;
  slidesCollection: {
    items: (ContentfulPromo | ContentfulPageInfoCardData)[];
  };
};
