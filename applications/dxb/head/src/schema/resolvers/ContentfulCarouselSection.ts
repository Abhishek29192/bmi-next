import resolveLink from "./ContentfulLink";
import resolvePromo from "./ContentfulPromo";
import resolveInfoCardData from "./ContentfulInfoCardData";
import type { ContentfulCarouselSection } from "./types/CarouselSection";
import type { Data as CarouselSectionData } from "../../components/carousel-section/CarouselSection";

const resolveCarouselSection = async ({
  slidesCollection,
  link,
  ...rest
}: ContentfulCarouselSection): Promise<CarouselSectionData> => {
  const cardPromises = slidesCollection.items.map((card) => {
    if (card.__typename === "Promo") {
      return resolvePromo(card);
    }

    return resolveInfoCardData(card);
  });

  return {
    ...rest,
    link: link ? await resolveLink(link) : null,
    slides: await Promise.all(cardPromises)
  };
};

export default resolveCarouselSection;
