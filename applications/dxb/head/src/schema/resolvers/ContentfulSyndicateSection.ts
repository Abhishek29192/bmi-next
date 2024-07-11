import { Data as SyndicateSectionData } from "../../components/SyndicateSection";
import resolvePromo from "./ContentfulPromo";
import resolveInfoCardData from "./ContentfulInfoCardData";
import type { ContentfulSyndicateSectionData } from "./types/SyndicateSection";

const resolveSyndicateSection = async ({
  syndicateSectionDescription,
  villainsCollection,
  ...rest
}: ContentfulSyndicateSectionData): Promise<SyndicateSectionData> => {
  const cardPromises = villainsCollection.items.map((card) => {
    if (card.__typename === "Promo") {
      return resolvePromo(card);
    }

    return resolveInfoCardData(card);
  });

  return {
    ...rest,
    description: syndicateSectionDescription,
    villains: await Promise.all(cardPromises)
  };
};

export default resolveSyndicateSection;
