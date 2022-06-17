import { System } from "../../types/pim";
import createAsset from "./AssetHelper";
import createBrand from "./BrandHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import createImage from "./ImageHelper";
import createPimSystemDocument from "./PimSystemDocumentHelper";
import createRelatedSystem from "./RelatedSystemHelper";

export const createSystem = (system?: Partial<System>): System => ({
  awardsAndCertificateDocuments: [
    createAsset(),
    createAsset({
      assetType: "CERTIFICATES"
    }),
    createAsset({
      allowedToDownload: false
    }),
    createAsset({
      mime: undefined
    }),
    createAsset({
      fileSize: 1.7976931348623157e308
    }),
    createAsset({
      fileSize: undefined
    }),
    createAsset({
      realFileName: undefined
    }),
    createAsset({
      url: undefined
    })
  ],
  awardsAndCertificateImages: [
    createAsset({
      format: "jpeg",
      mime: "image/jpeg"
    }),
    createAsset({
      format: "png",
      mime: "image/png",
      assetType: "CERTIFICATES"
    })
  ],
  bim: null,
  brand: createBrand(),
  categories: [createCategory()],
  code: "system-code",
  classifications: [createClassification()],
  description: "system-desc",
  documents: [
    createPimSystemDocument({ isLinkDocument: false }),
    createPimSystemDocument({ isLinkDocument: true })
  ],
  guaranteesAndWarrantiesImages: [
    createAsset({
      assetType: "GUARANTIES",
      format: "jpeg",
      mime: "image/jpeg",
      realFileName: "realfilename.jpeg"
    }),
    createAsset({
      assetType: "WARRANTIES",
      format: "png",
      mime: "image/png",
      realFileName: "realfilename.png"
    })
  ],
  guaranteesAndWarrantiesLinks: [
    createAsset({
      assetType: "GUARANTIES",
      allowedToDownload: false
    }),
    createAsset({
      assetType: "WARRANTIES",
      allowedToDownload: false
    })
  ],
  keyFeatures: null,
  images: [createImage()],
  layerCodes: [],
  name: "system-Name",
  promotionalContent: "",
  shortDescription: "system-desc",
  systemBenefits: [],
  systemReferences: null,
  systemLayers: [],
  specification: createAsset({ assetType: "SPECIFICATION" }),
  uniqueSellingPropositions: [],
  videos: [],
  path: "/s/path",
  relatedSystems: [createRelatedSystem()],
  scoringWeight: 0,
  ...system
});

export default createSystem;
