import createEntrySys from "./entrySysHelper";
import type { TypeSeoContent } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedSeoContent = (
  contentfulSeoContent?: EntryPartial<TypeSeoContent<undefined, "en-US">>
): TypeSeoContent<undefined, "en-US"> => {
  const seoContent = createSeoContent(contentfulSeoContent);
  return {
    ...seoContent,
    fields: {
      metaTitle: "seo content meta title",
      metaDescription: "seo content meta description",
      noIndex: false,
      ...seoContent.fields
    }
  };
};

const createSeoContent = (
  contentfulSeoContent?: EntryPartial<TypeSeoContent<undefined, "en-US">>
): TypeSeoContent<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "seoContent"
      }
    },
    ...contentfulSeoContent?.sys
  },
  metadata: {
    tags: [],
    ...contentfulSeoContent?.metadata
  },
  fields: {
    title: "seo content title",
    ...contentfulSeoContent?.fields
  }
});

export default createSeoContent;
