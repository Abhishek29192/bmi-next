import { Data } from "../../components/carousel-section/CarouselSection";
import createPromoData from "./PromoHelper";
import createLinkData from "./LinkHelper";

const createCarouselSectionData = (
  carouselSectionData?: Partial<Data>
): Data => ({
  __typename: "ContentfulCarouselSection",
  link: createLinkData(),
  variant: "horizontal",
  title: "Carousel Section Title",
  slides: [createPromoData()],
  ...carouselSectionData
});

export default createCarouselSectionData;
