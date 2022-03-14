import createEntrySys from "./entrySysHelper";
import createRichText from "./richTextHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import type { TypeSpecificationNotes } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedSpecificationNotes = (
  contentfulSpecificationNotes?: EntryPartial<
    TypeSpecificationNotes<undefined, "en-US">
  >
): TypeSpecificationNotes<undefined, "en-US"> => {
  const specificationNotes = createSpecificationNotes(
    contentfulSpecificationNotes
  );
  return {
    ...specificationNotes,
    fields: {
      title: "specification notes title",
      description: createRichText(),
      cta: createFullyPopulatedLink(),
      ...specificationNotes.fields
    }
  };
};

const createSpecificationNotes = (
  contentfulSpecificationNotes?: EntryPartial<
    TypeSpecificationNotes<undefined, "en-US">
  >
): TypeSpecificationNotes<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "specificationNotes"
      }
    },
    ...contentfulSpecificationNotes?.sys
  },
  metadata: {
    tags: [],
    ...contentfulSpecificationNotes?.metadata
  },
  fields: {
    name: "specification notes name",
    ...contentfulSpecificationNotes?.fields
  }
});

export default createSpecificationNotes;
