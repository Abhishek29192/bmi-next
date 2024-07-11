import { Data as LeadBlockData } from "../../../components/LeadBlockSection";
import { ContentfulRichText } from "./RichText";
import type { ContentfulLink } from "./Link";

export type ContentfulLeadBlock = Omit<
  LeadBlockData,
  "postItCard" | "text" | "link"
> & {
  link: ContentfulLink | null;
  postItCard: ContentfulRichText | null;
  text: ContentfulRichText;
};
