import createEntrySys from "./entrySysHelper";
import createRichText from "./richTextHelper";
import type { TypeTitleWithContent } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedTitleWithContent = (
  contentfulTitleWithContent?: EntryPartial<
    TypeTitleWithContent<undefined, "en-US">
  >
): TypeTitleWithContent<undefined, "en-US"> => {
  const titleWithContent = createTitleWithContent(contentfulTitleWithContent);
  return {
    ...titleWithContent,
    fields: {
      title: "title with content title",
      ...titleWithContent.fields
    }
  };
};

const createTitleWithContent = (
  contentfulTitleWithContent?: EntryPartial<
    TypeTitleWithContent<undefined, "en-US">
  >
): TypeTitleWithContent<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "titleWithContent"
      }
    },
    ...contentfulTitleWithContent?.sys
  },
  metadata: {
    tags: [],
    ...contentfulTitleWithContent?.metadata
  },
  fields: {
    name: "title with content name",
    content: createRichText(),
    ...contentfulTitleWithContent?.fields
  }
});

export default createTitleWithContent;
