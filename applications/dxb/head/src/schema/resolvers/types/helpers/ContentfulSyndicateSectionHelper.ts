import createContentfulPromo from "./ContentfulPromoHelper";
import createContentfulPageInfoData from "./ContentfulPageInfoDataHelper";
import type { ContentfulSyndicateSectionData } from "../SyndicateSection";

const createContentfulSyndicateSection = (
  syndicateSection?: Partial<ContentfulSyndicateSectionData>
): ContentfulSyndicateSectionData => ({
  __typename: "VillainSection",
  title: "Title",
  isReversed: false,
  syndicateSectionDescription: "Description",
  villainsCollection: {
    items: [createContentfulPromo(), createContentfulPageInfoData()]
  },
  ...syndicateSection
});

export default createContentfulSyndicateSection;
