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
  description: null,
  pimCode: "pim-code",
  ...contentfulAssetType
});

export default createContentfulAssetType;
