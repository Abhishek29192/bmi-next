import { ContentfulAssetType } from "../Contentful";

const createContentfulAssetType = (
  contentfulAssetType?: Partial<ContentfulAssetType>
): ContentfulAssetType => ({
  parent: null,
  children: [],
  internal: {
    type: "ContentfulAssetType",
    contentDigest: "digest",
    owner: "contentful"
  },
  __typename: "ContentfulAssetType",
  id: "contentful-asset-type",
  name: "Contentful Asset Type",
  code: "code",
  description: {
    raw: "raw description",
    references: []
  },
  pimCode: "pim-code",
  ...contentfulAssetType
});

export default createContentfulAssetType;
