import { Data as PIMDocumentData } from "../components/PIMDocument";
import createAssetType from "./AssetTypeHelper";
import createProduct from "./PimDocumentProductHelper";

const createPimDocument = (
  pimDocument?: Partial<PIMDocumentData>
): PIMDocumentData => ({
  __typename: "PIMDocument",
  id: "pim-document-id",
  title: "pim-document-title",
  product: createProduct(),
  url: "http://localhost/pim-document-id",
  assetType: createAssetType(),
  fileSize: 1,
  format: "application/pdf",
  extension: "pdf",
  realFileName: "pim-document-id.pdf",
  ...pimDocument
});

export default createPimDocument;
