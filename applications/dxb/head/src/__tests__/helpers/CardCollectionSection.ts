import createPageInfoData from "./PageInfoHelper";
import createPromoData from "./PromoHelper";
import type { Data as CardCollectionSectionData } from "../../components/CardCollectionSection";

const createCardCollectionSection = (
  cardCollectionSection?: Partial<CardCollectionSectionData>
): CardCollectionSectionData => ({
  __typename: "ContentfulCardCollectionSection",
  title: null,
  description: null,
  cardType: "Highlight Card",
  cardLabel: null,
  groupCards: null,
  cards: [createPageInfoData(), createPromoData()],
  sortOrder: null,
  link: null,
  justifyCenter: null,
  displaySingleRow: null,
  ...cardCollectionSection
});

export default createCardCollectionSection;
