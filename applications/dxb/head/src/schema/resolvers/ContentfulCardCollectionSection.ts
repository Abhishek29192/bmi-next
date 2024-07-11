import resolveLink from "./ContentfulLink";
import resolvePromo from "./ContentfulPromo";
import resolveInfoCardData from "./ContentfulInfoCardData";
import resolveRichText from "./ContentfulRichText";
import type { ContentfulCardCollection } from "./types/CardCollection";
import type { Data as CardCollectionData } from "../../components/CardCollectionSection";

const resolveCardCollectionSection = async ({
  cardsCollection,
  description,
  link,
  ...rest
}: ContentfulCardCollection): Promise<CardCollectionData> => {
  const cardPromises = cardsCollection.items.map((card) => {
    if (card.__typename === "Promo") {
      return resolvePromo(card);
    }

    return resolveInfoCardData(card);
  });

  return {
    ...rest,
    link: link ? await resolveLink(link) : null,
    cards: await Promise.all(cardPromises),
    description: description ? await resolveRichText(description) : null
  };
};

export default resolveCardCollectionSection;
