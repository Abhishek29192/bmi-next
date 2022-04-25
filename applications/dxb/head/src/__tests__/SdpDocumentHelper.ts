import { DocumentData as SDPDocumentData } from "../templates/systemDetails/types";
import createAssetType from "./AssetTypeHelper";

const createSdpDocument = (
  sdpDocument?: Partial<SDPDocumentData>
): SDPDocumentData => ({
  __typename: "SDPDocument",
  id: "sdp-document-id",
  title: "sdp-document-title",
  assetType: createAssetType(),
  asset: {
    file: {
      url: "http://localhost:8000/sdp-document-file-name.pdf",
      fileName: "sdp-document-file-name.pdf",
      contentType: "application/pdf",
      details: {
        size: 1000
      }
    }
  },
  ...sdpDocument
});

export default createSdpDocument;
