import createAsset from "./AssetHelper";
import createBim from "./BimHelper";
import createBrand from "./BrandHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import { createSystemDocument } from "./DocumentHelper";
import createFeature from "./FeatureHelper";
import createImage from "./ImageHelper";
import createKeyFeatures from "./KeyFeaturesHelper";
import createSystemLayer from "./SystemLayerHelper";
import { System } from "./types";
import createVideo from "./VideoHelper";

const createSystem = (system?: Partial<System>): System => ({
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
  bim: createBim(),
  brand: createBrand(),
  categories: [createCategory()],
  classifications: [
    createClassification({
      features: [
        createFeature({
          name: "Material",
          value: "Concrete"
        })
      ],
      name: "General"
    }),
    createClassification({
      features: [
        createFeature({
          name: "Length",
          value: "6 symbol"
        }),
        createFeature({
          name: "Width",
          value: "7 symbol"
        }),
        createFeature({
          name: "Height",
          value: "8 symbol"
        }),
        createFeature({
          name: "Thickness",
          value: "9 symbol"
        }),
        createFeature({
          name: "Volume",
          value: "10 symbol"
        })
      ],
      name: "Measurements"
    }),
    createClassification({
      features: [
        createFeature({
          name: "Gross Weight",
          value: "6 symbol"
        }),
        createFeature({
          name: "Net Weight",
          value: "7 symbol"
        }),
        createFeature({
          name: "Weight per Pallet",
          value: "8 symbol"
        }),
        createFeature({
          name: "Weight per Piece",
          value: "9 symbol"
        }),
        createFeature({
          name: "Weight per sq m",
          value: "10 symbol"
        })
      ],
      name: "Weight"
    })
  ],
  code: "system-1",
  description: "system-1-description",
  documents: [createSystemDocument()],
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
  hashedCode: "1234567890",
  images: [createImage()],
  keyFeatures: createKeyFeatures(),
  layerCodes: ["layer-1"],
  name: "system-1-name",
  path: "/s/system-1-system-1-name-1234567890",
  promotionalContent: "promotional-content",
  specification: createAsset({ assetType: "SPECIFICATION" }),
  scoringWeight: 0.5,
  shortDescription: "system-1-short-description",
  systemBenefits: ["system-benefits"],
  systemReferences: ["test-reference"],
  systemLayers: [createSystemLayer()],
  uniqueSellingPropositions: ["unique-selling-proposition"],
  videos: [createVideo()],
  ...system
});

export default createSystem;
