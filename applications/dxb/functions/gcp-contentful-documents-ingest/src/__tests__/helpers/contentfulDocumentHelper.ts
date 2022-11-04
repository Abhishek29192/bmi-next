import { createRichText } from "@bmi/contentful-types";
import { ContentfulDocument } from "../../types";
import createSysLink from "./sysLinkHelper";

export const createFullyPopulatedDocument = (
  contentfulDocument?: Partial<ContentfulDocument>
): ContentfulDocument => ({
  ...createContentfulDocument(),
  description: {
    "en-US": createRichText(),
    "no-NO": createRichText()
  },
  brand: {
    "en-US": "AeroDek",
    "no-NO": "AeroDek"
  },
  featuredMedia: {
    "en-US": {
      sys: createSysLink<"Entry">({
        linkType: "Entry",
        id: "featured-media-id"
      })
    },
    "no-NO": {
      sys: createSysLink<"Entry">({
        linkType: "Entry",
        id: "featured-media-id"
      })
    }
  },
  noIndex: {
    "en-US": false,
    "no-NO": false
  },
  ...contentfulDocument
});

const createContentfulDocument = (
  contentfulDocument?: Partial<ContentfulDocument>
): ContentfulDocument => ({
  title: {
    "en-US": "Contentful Document Title",
    "no-NO": "Cøntentful Døcument Title"
  },
  asset: {
    "en-US": {
      sys: createSysLink<"Asset">({ linkType: "Asset", id: "asset-id" })
    },
    "no-NO": {
      sys: createSysLink<"Asset">({ linkType: "Asset", id: "asset-id" })
    }
  },
  assetType: {
    "en-US": {
      sys: createSysLink<"Entry">({ linkType: "Entry", id: "asset-type-id" })
    },
    "no-NO": {
      sys: createSysLink<"Entry">({ linkType: "Entry", id: "asset-type-id" })
    }
  },
  ...contentfulDocument
});

export default createContentfulDocument;
