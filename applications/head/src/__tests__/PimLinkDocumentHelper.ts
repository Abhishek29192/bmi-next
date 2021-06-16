import { PIMLinkDocumentData } from "../components/types/PIMDocumentBase";
import createAssetType from "./AssetTypeHelper";
import createProduct from "./PimDocumentProductHelper";

const createPimLinkDocument = (
  pimLinkDocument?: Partial<PIMLinkDocumentData>
): PIMLinkDocumentData => ({
  __typename: "PIMLinkDocument",
  id: "pim-link-document-id",
  title: "pim-link-document-title",
  product: createProduct(),
  url: "http://localhost/pim-link-document-id",
  assetType: createAssetType(),
  ...pimLinkDocument
});

export default createPimLinkDocument;
