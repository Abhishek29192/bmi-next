import createContentfulPromoData from "./ContentfulPromoHelper";
import createContentfulInfoPageData from "./ContentfulPageInfoDataHelper";
import createContentfulLink from "./ContentfulLinkHelper";
import type { ContentfulCarouselSection } from "../CarouselSection";

const createContentfulCarouselSection = (
  data?: Partial<ContentfulCarouselSection>
): ContentfulCarouselSection => ({
  __typename: "CarouselSection",
  title: "Title",
  slidesCollection: {
    items: [createContentfulInfoPageData(), createContentfulPromoData()]
  },
  link: createContentfulLink(),
  variant: "vertical",
  ...data
});

export default createContentfulCarouselSection;
