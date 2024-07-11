import type { Data as CardCollectionData } from "../../../components/CardCollectionSection";
import type { ContentfulLink } from "./Link";
import type { ContentfulPromo } from "./Promo";
import type { ContentfulPageInfoCardData } from "./PageInfoCardData";
import type { ContentfulRichText } from "./RichText";

export type ContentfulCardCollection = Omit<
  CardCollectionData,
  "link" | "cards" | "description"
> & {
  link: ContentfulLink | null;
  cardsCollection: {
    items: (ContentfulPromo | ContentfulPageInfoCardData)[];
  };
  description: ContentfulRichText | null;
};
