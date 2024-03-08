import createEntrySys from "./entrySysHelper";
import createLink from "./linkHelper";
import createSimplePage from "./simplePageHelper";
import type { EntryPartial } from "./helperTypes";
import type { TypeNavigation } from "../types";

export const createFullyPopulatedNavigation = (
  contentfulNavigation?: EntryPartial<TypeNavigation<undefined, "en-US">>
): TypeNavigation<undefined, "en-US"> => {
  const navigation = createNavigation(contentfulNavigation);

  return {
    ...navigation,
    fields: {
      link: createLink(),
      promo: createSimplePage(),
      promos: [createSimplePage()],
      ...navigation.fields
    }
  };
};

const createNavigation = (
  contentfulNavigation?: EntryPartial<TypeNavigation<undefined, "en-US">>
): TypeNavigation<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "navigation"
      }
    },
    ...contentfulNavigation?.sys
  },
  metadata: {
    tags: [],
    ...contentfulNavigation?.metadata
  },
  fields: {
    title: "navigation title",
    label: "navigation label",
    links: [],
    ...contentfulNavigation?.fields
  }
});

export default createNavigation;
