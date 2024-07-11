import createContentfulRichText from "./ContentfulRichText";
import type { ContentfulTitleWithContentData } from "../TitleWithContent";

const createContentfulTitleWithContent = (
  contentfulTitleWithContentData?: Partial<ContentfulTitleWithContentData>
): ContentfulTitleWithContentData => ({
  __typename: "TitleWithContent",
  name: "Title with content name",
  title: "Title with content title",
  content: createContentfulRichText(),
  ...contentfulTitleWithContentData
});

export default createContentfulTitleWithContent;
