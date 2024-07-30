import { ContentfulDocument as ContentfulDocumentData } from "../../types/Document";
import createAssetType from "./AssetTypeHelper";

const createContentfulDocument = (
  pimDocument?: Partial<ContentfulDocumentData>
): ContentfulDocumentData => ({
  __typename: "ContentfulDocument",
  id: "contentful-document-id",
  title: "contentful-document-title",
  assetType: createAssetType(),
  featuredMedia: {
    __typename: "Image",
    title: "Title",
    type: "Decorative",
    altText: "alt text",
    focalPoint: {
      x: 0,
      y: 0
    },
    image: {
      fileName: "Lorem ipsum",
      contentType: "image/jpg",
      url: "//doesnot-exist.com/image.jpg?w=1296&h=864&fl=progressive&q=50&fm=jpg",
      width: 200,
      height: 200,
      size: 100
    }
  },
  asset: {
    file: {
      url: "http://doesnot-exist.com/fileName",
      fileName: `fileName`,
      contentType: "image/jpg",
      details: {
        size: 89898
      }
    }
  },
  description: null,
  brand: null,
  noIndex: false,
  ...pimDocument
});

export default createContentfulDocument;
