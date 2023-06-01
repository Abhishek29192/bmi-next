import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedImage } from "./imageHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import createRichText from "./richTextHelper";
import { createFullyPopulatedTag } from "./tagHelper";
import { createFullyPopulatedVideo } from "./videoHelper";
import type { TypePromo } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedPromo = (
  contentfulPromo?: EntryPartial<TypePromo<undefined, "en-US">>
): TypePromo<undefined, "en-US"> => {
  const promo = createPromo(contentfulPromo);
  return {
    ...promo,
    fields: {
      title: "promo title",
      brandLogo: "Awak",
      featuredImage: undefined, // Should be deleted
      featuredMedia: createFullyPopulatedImage(),
      featuredVideo: createFullyPopulatedVideo(),
      subtitle: "promo subtitle",
      body: createRichText(),
      cta: createFullyPopulatedLink(),
      tags: [createFullyPopulatedTag()],
      backgroundColor: "White",
      ...promo.fields
    }
  };
};

const createPromo = (
  contentfulPromo?: EntryPartial<TypePromo<undefined, "en-US">>
): TypePromo<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "promo"
      }
    },
    ...contentfulPromo?.sys
  },
  metadata: {
    tags: [],
    ...contentfulPromo?.metadata
  },
  fields: {
    name: "promo name",
    ...contentfulPromo?.fields
  }
});

export default createPromo;
