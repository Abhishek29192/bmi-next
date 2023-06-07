import createEntrySys from "./entrySysHelper";
import type { TypeTag } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedTag = (
  contentfulTag?: EntryPartial<TypeTag<undefined, "en-US">>
): TypeTag<undefined, "en-US"> => {
  return createTag(contentfulTag);
};

const createTag = (
  contentfulTag?: EntryPartial<TypeTag<undefined, "en-US">>
): TypeTag<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "tag"
      }
    },
    ...contentfulTag?.sys
  },
  metadata: {
    tags: [],
    ...contentfulTag?.metadata
  },
  fields: {
    title: "tag title",
    type: "Page type",
    ...contentfulTag?.fields
  }
});

export default createTag;
