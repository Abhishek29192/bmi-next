import createEntrySys from "./entrySysHelper";
import createRichText from "./richTextHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import type { TypeLeadBlockSection } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedLeadBlock = (
  contentfulLeadBlock?: EntryPartial<TypeLeadBlockSection<undefined, "en-US">>
): TypeLeadBlockSection<undefined, "en-US"> => {
  const leadBlock = createLeadBlock(contentfulLeadBlock);
  return {
    ...leadBlock,
    fields: {
      link: createFullyPopulatedLink(),
      postItCard: createRichText(),
      ...leadBlock.fields
    }
  };
};

const createLeadBlock = (
  contentfulLeadBlock?: EntryPartial<TypeLeadBlockSection<undefined, "en-US">>
): TypeLeadBlockSection<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "leadBlockSection"
      }
    },
    ...contentfulLeadBlock?.sys
  },
  metadata: {
    tags: [],
    ...contentfulLeadBlock?.metadata
  },
  fields: {
    title: "lead block title",
    text: createRichText(),
    ...contentfulLeadBlock?.fields
  }
});

export default createLeadBlock;
