import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedImage } from "./imageHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import createContentfulDate from "./contentfulDateHelper";
import { createFullyPopulatedTitleWithContent } from "./titleWithContentHelper";
import { createFullyPopulatedShareWidget } from "./shareWidgetHelper";
import { createFullyPopulatedTag } from "./tagHelper";
import { createFullyPopulatedSignupBlock } from "./signupBlockHelper";
import { createFullyPopulatedVideo } from "./videoHelper";
import { createFullyPopulatedLeadBlock } from "./leadBlockHelper";
import { createFullyPopulatedLinkColumns } from "./linkColumnHelper";
import { createFullyPopulatedSeoContent } from "./seoHelper";
import type { TypePage } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedSimplePage = (
  contentfulPage?: EntryPartial<TypePage<undefined, "en-US">>
): TypePage<undefined, "en-US"> => {
  const page = createSimplePage(contentfulPage);
  return {
    ...page,
    fields: {
      ...page.fields,
      featuredImage: undefined, // Should be deleted
      featuredMedia: createFullyPopulatedImage(),
      featuredVideo: createFullyPopulatedVideo(),
      brandLogo: "AeroDek",
      subtitle: "page subtitle",
      cta: createFullyPopulatedLink(),
      shareWidget: createFullyPopulatedShareWidget(),
      leadBlock: createFullyPopulatedLeadBlock(),
      date: createContentfulDate(0),
      sections: [createFullyPopulatedTitleWithContent()],
      linkColumns: createFullyPopulatedLinkColumns(),
      nextBestActions: [createSimplePage()],
      tags: [createFullyPopulatedTag()],
      parentPage: undefined,
      seo: createFullyPopulatedSeoContent(),
      subtitleShortText: "page short text",
      breadcrumbTitle: "breadcrumb title",
      signupBlock: createFullyPopulatedSignupBlock(),
      ...contentfulPage?.fields
    }
  };
};

const createSimplePage = (
  contentfulPage?: EntryPartial<TypePage<undefined, "en-US">>
): TypePage<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "page"
      }
    },
    ...contentfulPage?.sys
  },
  metadata: {
    tags: [],
    ...contentfulPage?.metadata
  },
  fields: {
    name: "page name",
    title: "page title",
    slug: "slug",
    heroType: "Level 1",
    ...contentfulPage?.fields
  }
});

export default createSimplePage;
