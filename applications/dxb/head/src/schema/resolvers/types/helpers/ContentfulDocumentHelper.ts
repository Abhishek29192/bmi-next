import { ContentfulDocument } from "../Contentful";

const createContentfulDocument = (
  contentfulDocument?: Partial<ContentfulDocument>
): ContentfulDocument => ({
  parent: null,
  children: [],
  internal: {
    type: "ContentfulDocument",
    contentDigest: "digest",
    owner: "contentful"
  },
  __typename: "ContentfulDocument",
  id: "contentful-document",
  title: "Contentful Document",
  assetType___NODE: "asset-type",
  featuredMedia___Node: "featured-media",
  asset___Node: "asset",
  // TODO: add validations for this Rich Text field in CMS
  description: {
    raw: "raw description",
    references: []
  },
  brand: "brand",
  noIndex: false,
  ...contentfulDocument
});

export default createContentfulDocument;
