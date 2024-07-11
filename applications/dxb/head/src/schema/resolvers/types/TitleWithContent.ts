import type { Data as TitleWithContentData } from "../../../components/TitleWithContent";
import type { ContentfulRichText } from "./RichText";

export type ContentfulTitleWithContentData = Omit<
  TitleWithContentData,
  "content"
> & {
  content: ContentfulRichText;
};
