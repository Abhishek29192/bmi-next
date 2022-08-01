import { SystemDocument as PIMSystemDocument } from "../../types/pim";
import createAssetType from "./AssetTypeHelper";

const createPimSystemDocument = (
  pimLinkDocument?: Partial<PIMSystemDocument>
): PIMSystemDocument => ({
  __typename: "PIMSystemDocument",
  assetType: createAssetType(),
  realFileName: "real-file-name",
  fileSize: 10,
  format: "application/pdf",
  extension: "pdf",
  id: "pim-link-document-id",
  isLinkDocument: true,
  title: "pim-link-document-title",
  url: "http://localhost/pim-link-document-id",
  ...pimLinkDocument
});

export default createPimSystemDocument;
