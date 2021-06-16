import { Data as ContentfulDocumentData } from "../components/Document";
import createAssetType from "./AssetTypeHelper";

const createContentfulDocument = (
  pimDocument?: Partial<ContentfulDocumentData>
): ContentfulDocumentData => ({
  __typename: "ContentfulDocument",
  id: "contentful-document-id",
  title: "contentful-document-title",
  assetType: createAssetType(),
  image: {
    resize: {
      src: ""
    }
  },
  asset: {
    file: {
      url: "http://doesnot-exist.com/fileName",
      fileName: `fileName`,
      contentType: "",
      details: {
        size: 89898
      }
    }
  },
  description: null,
  brand: null,
  ...pimDocument
});

export default createContentfulDocument;
