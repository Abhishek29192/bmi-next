import createContentfulPromoData from "./ContentfulPromoHelper";
import createContentfulInfoPageData from "./ContentfulPageInfoDataHelper";
import type { ContentfulCardCollection } from "../CardCollection";

const createContentfulCardCollectionSection = (
  data?: Partial<ContentfulCardCollection>
): ContentfulCardCollection => ({
  __typename: "CardCollectionSection",
  title: null,
  description: null,
  cardType: "Highlight Card",
  cardLabel: null,
  groupCards: null,
  cardsCollection: {
    items: [createContentfulInfoPageData(), createContentfulPromoData()]
  },
  sortOrder: null,
  link: null,
  justifyCenter: null,
  displaySingleRow: null,
  ...data
});

export default createContentfulCardCollectionSection;
