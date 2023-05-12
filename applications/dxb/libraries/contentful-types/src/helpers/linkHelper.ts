import { createFullyPopulatedAsset } from "./assetHelper";
import createEntrySys from "./entrySysHelper";
import createSimplePage from "./simplePageHelper";
import { createFullyPopulatedTitleWithContent } from "./titleWithContentHelper";
import type { TypeLink } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedLink = (
  contentfulLink?: EntryPartial<TypeLink<undefined, "en-US">>
): TypeLink<undefined, "en-US"> => {
  const image = createLink(contentfulLink);
  return {
    ...image,
    fields: {
      ...image.fields,
      isLabelHidden: false,
      icon: "BMI",
      linkedPage: createSimplePage(),
      queryParams: "query-params",
      url: "http://localhost:8080",
      asset: createFullyPopulatedAsset(),
      parameters: {},
      dialogContent: createFullyPopulatedTitleWithContent(),
      hubSpotCTAID: "hubspot-cta-id",
      ...contentfulLink?.fields
    }
  };
};

const createLink = (
  contentfulLink?: EntryPartial<TypeLink<undefined, "en-US">>
): TypeLink<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "link"
      }
    },
    ...contentfulLink?.sys
  },
  metadata: {
    tags: [],
    ...contentfulLink?.metadata
  },
  fields: {
    name: "link name",
    label: "link label",
    type: "External",
    ...contentfulLink?.fields
  }
});

export default createLink;
