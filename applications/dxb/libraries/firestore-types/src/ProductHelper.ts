import { createCategory } from "@bmi/pim-types";
import createAsset from "./AssetHelper";
import createBrand from "./BrandHelper";
import createClassification from "./ClassificationHelper";
import { createProductDocument } from "./DocumentHelper";
import createFeature from "./FeatureHelper";
import createFilter from "./FilterHelper";
import createImage from "./ImageHelper";
import createMeasurements from "./MeasurementsHelper";
import createRelatedVariant from "./RelatedVariantHelper";
import { Product } from "./types";
import createVideo from "./VideoHelper";
import createWeight from "./WeightHelper";

const createProduct = (product?: Partial<Product>): Product => ({
  approvalStatus: "approved",
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
  baseCode: "code",
  baseScoringWeight: 100,
  bimIframeUrl: "http://localhost:8000",
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
  code: "code",
  colour: "Shadow Black",
  colourFamily: "Black",
  colourMicrocopy: "Colour",
  description: "<p>Long description</p>",
  documents: [
    createProductDocument({
      assetType: "ASSEMBLY_INSTRUCTIONS",
      extension: "pdf",
      fileSize: 10,
      format: "application/pdf",
      id: "2583923841",
      isLinkDocument: false,
      productBaseCode: "code",
      productName: "name",
      realFileName: "real-file-name.pdf",
      title: "name",
      url: "http://localhost:8000"
    }),
    createProductDocument({
      assetType: "AWARDS"
    }),
    createProductDocument({
      assetType: "CERTIFICATES"
    }),
    createProductDocument({
      isLinkDocument: true
    }),
    createProductDocument({
      assetType: "BIM"
    }),
    createProductDocument({
      assetType: "FIXING_TOOL"
    }),
    createProductDocument({
      assetType: "GUARANTIES"
    }),
    createProductDocument({
      assetType: "SPECIFICATION"
    }),
    createProductDocument({
      assetType: "VIDEO",
      url: "https://www.youtube.com/watch?v=3901c0ds7oo"
    }),
    createProductDocument({
      assetType: "WARRANTIES"
    })
  ],
  externalProductCode: "external-product-code",
  filters: [
    createFilter({
      code: "code",
      filterCode: "appearanceAttributes.colour",
      groupLabel: "Colour",
      isCategory: false,
      name: "Colour",
      parentFilterCode: "",
      value: "Shadow Black",
      unit: undefined
    }),
    createFilter({
      code: "code",
      filterCode: "appearanceAttributes.colourfamily",
      groupLabel: "Colour Family",
      isCategory: false,
      name: "Colour Family",
      parentFilterCode: "",
      value: "Black",
      unit: undefined
    }),
    createFilter({
      code: "code",
      filterCode: "appearanceAttributes.texturefamily",
      groupLabel: "Texture Family",
      isCategory: false,
      name: "Texture Family",
      parentFilterCode: "",
      value: "Gloss",
      unit: undefined
    }),
    createFilter({
      code: "code",
      filterCode: "appearanceAttributes.variantattribute",
      groupLabel: "Variant Attribute",
      isCategory: false,
      name: "Variant Attribute",
      parentFilterCode: "",
      value: "Shadow Black Gloss 6x7x8x9x10",
      unit: undefined
    }),
    createFilter({
      code: "code",
      filterCode: "generalInformation.materials",
      groupLabel: "Material",
      isCategory: false,
      name: "Material",
      parentFilterCode: "",
      value: "Concrete",
      unit: undefined
    }),
    createFilter({
      code: "",
      filterCode: "measurements.length",
      groupLabel: "Length",
      isCategory: false,
      name: "Length",
      parentFilterCode: "",
      unit: "symbol",
      value: "6"
    }),
    createFilter({
      code: "",
      filterCode: "measurements.width",
      groupLabel: "Width",
      isCategory: false,
      name: "Width",
      parentFilterCode: "",
      unit: "symbol",
      value: "7"
    }),
    createFilter({
      code: "",
      filterCode: "measurements.height",
      groupLabel: "Height",
      isCategory: false,
      name: "Height",
      parentFilterCode: "",
      unit: "symbol",
      value: "8"
    }),
    createFilter({
      code: "",
      filterCode: "measurements.thickness",
      groupLabel: "Thickness",
      isCategory: false,
      name: "Thickness",
      parentFilterCode: "",
      unit: "symbol",
      value: "9"
    }),
    createFilter({
      code: "",
      filterCode: "measurements.volume",
      groupLabel: "Volume",
      isCategory: false,
      name: "Volume",
      parentFilterCode: "",
      unit: "symbol",
      value: "10"
    }),
    createFilter({
      code: "",
      filterCode: "weightAttributes.grossweight",
      groupLabel: "Gross Weight",
      isCategory: false,
      name: "Gross Weight",
      parentFilterCode: "",
      unit: "symbol",
      value: "6"
    }),
    createFilter({
      code: "",
      filterCode: "weightAttributes.netweight",
      groupLabel: "Net Weight",
      isCategory: false,
      name: "Net Weight",
      parentFilterCode: "",
      unit: "symbol",
      value: "7"
    }),
    createFilter({
      code: "",
      filterCode: "weightAttributes.weightperpallet",
      groupLabel: "Weight per Pallet",
      isCategory: false,
      name: "Weight per Pallet",
      parentFilterCode: "",
      unit: "symbol",
      value: "8"
    }),
    createFilter({
      code: "",
      filterCode: "weightAttributes.weightperpiece",
      groupLabel: "Weight per Piece",
      isCategory: false,
      name: "Weight per Piece",
      parentFilterCode: "",
      unit: "symbol",
      value: "9"
    }),
    createFilter({
      code: "",
      filterCode: "weightAttributes.weightpersqm",
      groupLabel: "Weight per sq m",
      isCategory: false,
      name: "Weight per sq m",
      parentFilterCode: "",
      unit: "symbol",
      value: "10"
    }),
    createFilter({
      code: "code",
      filterCode: "Brand",
      isCategory: true,
      name: "name",
      parentFilterCode: "parent-category-code",
      value: "code"
    })
  ],
  fixingToolIframeUrl: "http://localhost:8000",
  galleryImages: [createImage()],
  groups: [{ label: "group", code: "group" }],
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
  hashedCode: "1853176582",
  isSampleOrderAllowed: true,
  isVisualiserAvailable: false,
  masterImage: createImage(),
  materials: "Concrete",
  measurements: createMeasurements(),
  name: "name",
  path: "/p/name-shadow-black-concrete-gloss-1853176582",
  productBenefits: ["product-benefits"],
  relatedVariants: [createRelatedVariant()],
  specificationIframeUrl: "http://localhost:8000",
  techDrawings: [createImage()],
  textureFamily: "Gloss",
  textureFamilyMicrocopy: "Colour",
  variantAttribute: "Shadow Black Gloss 6x7x8x9x10",
  videos: [createVideo()],
  weight: createWeight(),
  ...product
});

export default createProduct;
