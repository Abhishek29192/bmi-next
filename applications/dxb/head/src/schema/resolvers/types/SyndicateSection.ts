import type { Data as SyndicateSectionData } from "../../../components/SyndicateSection";
import type { ContentfulPromo } from "./Promo";
import type { ContentfulPageInfoCardData } from "./PageInfoCardData";

export type ContentfulSyndicateSectionData = Omit<
  SyndicateSectionData,
  "description" | "villains"
> & {
  syndicateSectionDescription: string | null;
  villainsCollection: {
    items: (ContentfulPromo | ContentfulPageInfoCardData)[];
  };
};
