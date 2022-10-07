import createContentfulAssetType from "./ContentfulAssetTypeHelper";
import { createFullyPopulatedContenfulImage } from "./ContentfulImageHelper";
import { ContentfulDocument } from "./types";

export const createFullyPopulatedContentfulDocument = (
  contentfulDocument?: Partial<ContentfulDocument>
): ContentfulDocument => ({
  ...createContentfulDocument(),
  featuredMedia: createFullyPopulatedContenfulImage(),
  BRAND: {
    name: "brand",
    code: "brand"
  },
  ...contentfulDocument
});

const createContentfulDocument = (
  contentfulDocument?: Partial<ContentfulDocument>
): ContentfulDocument => ({
  __typename: "ContentfulDocument",
  id: "contentful-document-id",
  title: "contentful document title",
  titleAndSize: "contentful document title 1",
  realFileName: "contentful-document-real-file-name.jpg",
  assetType: createContentfulAssetType(),
  asset: {
    file: {
      url: "http://localhost:9000/asset-filename.jpg",
      fileName: "asset-filename.jpg",
      contentType: "image/jpeg",
      details: {
        size: 1
      }
    }
  },
  noIndex: false,
  ...contentfulDocument
});

export default createContentfulDocument;
