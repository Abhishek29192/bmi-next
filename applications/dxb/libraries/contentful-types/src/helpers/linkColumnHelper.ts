import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedNavigation } from "./navigationHelper";
import type { EntryPartial } from "./helperTypes";
import type { TypeLinkColumnsSection } from "../types";

export const createFullyPopulatedLinkColumns = (
  contentfulLinkColumns?: EntryPartial<
    TypeLinkColumnsSection<undefined, "en-US">
  >
): TypeLinkColumnsSection<undefined, "en-US"> => {
  const linkColumns = createLinkColumns(contentfulLinkColumns);
  return {
    ...linkColumns,
    fields: {
      title: "link columns title",
      ...linkColumns.fields
    }
  };
};

const createLinkColumns = (
  contentfulLinkColumns?: EntryPartial<
    TypeLinkColumnsSection<undefined, "en-US">
  >
): TypeLinkColumnsSection<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "linkColumnsSection"
      }
    },
    ...contentfulLinkColumns?.sys
  },
  metadata: {
    tags: [],
    ...contentfulLinkColumns?.metadata
  },
  fields: {
    name: "link columns name",
    columns: [createFullyPopulatedNavigation()],
    ...contentfulLinkColumns?.fields
  }
});

export default createLinkColumns;
