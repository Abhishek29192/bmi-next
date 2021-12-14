import {
  ApprovalStatus,
  AssetAssetType,
  ClassificationCodeEnum,
  ImageFormat,
  ImageMime,
  Mime,
  System
} from "../components/types/pim";
import {
  createBaseProduct,
  createVariantOption
} from "../__tests__/PimDocumentProductHelper";
import { ImageAssetTypesEnum } from "../components/types/pim";

const mockAssets = [
  {
    allowedToDownload: true,
    assetType: "AWARDS",
    fileSize: 7454,
    mime: "image/png",
    name: "Test Award",
    realFileName: "Test_Award.png",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h71/hf4/9021244014622/Test-Awardpng"
  },
  {
    allowedToDownload: true,
    assetType: "BIM",
    mime: "application/octet-stream",
    name: "BIM Test",
    url: "https://www.bimobject.com/en/bmi_siplast_fr/product/spl30030"
  },
  {
    allowedToDownload: true,
    assetType: "WARRANTIES",
    fileSize: 8470,
    mime: "image/jpeg",
    name: "Monier garanti 30 år",
    realFileName: "Monier garanti 30 år.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hbc/hd9/9009904058398/Monier-garanti-30-arjpg"
  },
  {
    allowedToDownload: true,
    assetType: "CAD",
    fileSize: 270539,
    mime: "application/pdf",
    name: "CAD",
    realFileName: "1344416763.pdf",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h63/h2d/9021403922462/1344416763pdf"
  },
  {
    allowedToDownload: false,
    assetType: "DATA_SHEETS",
    fileSize: 390375,
    mime: "application/pdf",
    name: "Icopal Ventura",
    realFileName: "Icopal Ventura.pdf",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hb2/hf0/9021244145694/Icopal-Venturapdf"
  },
  {
    allowedToDownload: true,
    assetType: "SPECIFICATION",
    fileSize: 689490,
    mime: "application/pdf",
    name: "Spec Test",
    realFileName: "Teknisk-godkjenning-2012-Icopal-2-lag-asfalt-takbelegg.pdf",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hd4/hbd/9021243883550/Teknisk-godkjenning-2012-Icopal-2-lag-asfalt-takbeleggpdf"
  },
  {
    allowedToDownload: true,
    assetType: "GUARANTIES",
    fileSize: 12750,
    mime: "image/png",
    name: "Test_Guarantee",
    realFileName: "Test_Guarantee.png",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h6c/hba/9021243785246/Test-Guaranteepng"
  },
  {
    allowedToDownload: true,
    assetType: "CERTIFICATES",
    fileSize: 8364,
    mime: "image/png",
    name: "test_Certificate",
    realFileName: "test_Certificate.png",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/haf/hf3/9021244080158/test-Certificatepng"
  }
];
const mockImages = [
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 1852238,
    mime: "image/jpeg",
    name: "490189 wireløper",
    realFileName: "490189 wireløper.jpg",
    format: "Product-Listing-Card-Mobile",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h7b/hdd/9009904189470/490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 172262,
    format: "Product-Hero-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Hero-Large-Desktop_490189 wireløper",
    realFileName: "Product-Hero-Large-Desktop_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h91/he2/9009920507934/Product-Hero-Large-Desktop-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 37747,
    format: "Product-Color-Selector-Mobile",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Mobile_490189 wireløper",
    realFileName: "Product-Color-Selector-Mobile_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h53/he3/9009920573470/Product-Color-Selector-Mobile-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 48469,
    format: "Product-Listing-Card-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Large-Desktop_490189 wireløper",
    realFileName: "Product-Listing-Card-Large-Desktop_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h51/he6/9009920639006/Product-Listing-Card-Large-Desktop-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 91097,
    format: "Product-Hero-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Hero-Small-Desktop-Tablet_490189 wireløper",
    realFileName: "Product-Hero-Small-Desktop-Tablet_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h62/he9/9009920704542/Product-Hero-Small-Desktop-Tablet-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 79391,
    format: "Product-Hero-Mobile",
    mime: "image/jpeg",
    name: "Product-Hero-Mobile_490189 wireløper",
    realFileName: "Product-Hero-Mobile_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h23/hea/9009920770078/Product-Hero-Mobile-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 85285,
    format: "Product-Color-Selector-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Large-Desktop_490189 wireløper",
    realFileName: "Product-Color-Selector-Large-Desktop_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h21/hed/9009920835614/Product-Color-Selector-Large-Desktop-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 51384,
    format: "Product-Color-Selector-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Small-Desktop-Tablet_490189 wireløper",
    realFileName:
      "Product-Color-Selector-Small-Desktop-Tablet_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h32/hf0/9009920901150/Product-Color-Selector-Small-Desktop-Tablet-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 30099,
    format: "Product-Listing-Card-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Small-Desktop-Tablet_490189 wireløper",
    realFileName:
      "Product-Listing-Card-Small-Desktop-Tablet_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/he0/hf0/9009920966686/Product-Listing-Card-Small-Desktop-Tablet-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 31599,
    format: "Product-Listing-Card-Mobile",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Mobile_490189 wireløper",
    realFileName: "Product-Listing-Card-Mobile_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h62/hc4/9009921032222/Product-Listing-Card-Mobile-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_490189 wireløper.jpg",
    fileSize: 656011,
    format: "Web",
    mime: "image/jpeg",
    name: "Web_490189 wireløper",
    realFileName: "Web_490189 wireløper.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hb4/hc3/9009921097758/Web-490189-wireloperjpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.MASTER_IMAGE,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 1675344,
    format: "Print",
    mime: "image/tiff",
    name: "Print_490189 wireløper",
    realFileName: "Print_490189 wireløper.tiff",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/ha3/hc0/9009921163294/Print-490189-wirelopertiff"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 536828,
    mime: "image/png",
    format: "Product-Hero-Large-Desktop",
    name: "Icopal ståltakrenne miljøbilde 3",
    realFileName: "Icopal ståltakrenne miljøbilde 3.png",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcc/hdc/9009904123934/Icopal-staltakrenne-miljobilde-3png"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 113935,
    format: "Product-Hero-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Hero-Large-Desktop_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Hero-Large-Desktop_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h4b/h2d/9009919787038/Product-Hero-Large-Desktop-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 11333,
    format: "Product-Color-Selector-Mobile",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Mobile_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Color-Selector-Mobile_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h3b/h2a/9009919852574/Product-Color-Selector-Mobile-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 27886,
    format: "Product-Listing-Card-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Large-Desktop_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Listing-Card-Large-Desktop_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h3c/h27/9009919918110/Product-Listing-Card-Large-Desktop-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 64047,
    format: "Product-Hero-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Hero-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Hero-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h7b/h26/9009919983646/Product-Hero-Small-Desktop-Tablet-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 18923,
    format: "Product-Hero-Mobile",
    mime: "image/jpeg",
    name: "Product-Hero-Mobile_Icopal ståltakrenne miljøbilde 3",
    realFileName: "Product-Hero-Mobile_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hf3/hd1/9009920049182/Product-Hero-Mobile-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 37831,
    format: "Product-Color-Selector-Large-Desktop",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Large-Desktop_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Color-Selector-Large-Desktop_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h04/hd5/9009920114718/Product-Color-Selector-Large-Desktop-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 18923,
    format: "Product-Color-Selector-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Color-Selector-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Color-Selector-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hc5/hd5/9009920180254/Product-Color-Selector-Small-Desktop-Tablet-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 11855,
    format: "Product-Listing-Card-Small-Desktop-Tablet",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Listing-Card-Small-Desktop-Tablet_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hc3/hd8/9009920245790/Product-Listing-Card-Small-Desktop-Tablet-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 13451,
    format: "Product-Listing-Card-Mobile",
    mime: "image/jpeg",
    name: "Product-Listing-Card-Mobile_Icopal ståltakrenne miljøbilde 3",
    realFileName:
      "Product-Listing-Card-Mobile_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hd4/hdb/9009920311326/Product-Listing-Card-Mobile-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 48547,
    format: "Web",
    mime: "image/jpeg",
    name: "Web_Icopal ståltakrenne miljøbilde 3",
    realFileName: "Web_Icopal ståltakrenne miljøbilde 3.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h82/hdc/9009920376862/Web-Icopal-staltakrenne-miljobilde-3jpg"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.GALLERY,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 418712,
    format: "Print",
    mime: "image/tiff",
    name: "Print_Icopal ståltakrenne miljøbilde 3",
    realFileName: "Print_Icopal ståltakrenne miljøbilde 3.tiff",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h94/hdf/9009920442398/Print-Icopal-staltakrenne-miljobilde-3tiff"
  },
  {
    allowedToDownload: true,
    assetType: ImageAssetTypesEnum.TECHNICAL_DRAWINGS,
    containerId: "container_Icopal ståltakrenne miljøbilde 3.png",
    fileSize: 21146,
    mime: "image/png",
    name: "Technical Drawing",
    realFileName: "XaPdA.png",
    format: "Product-Hero-Small-Desktop-Tablet",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h4d/hbc/9022833491998/XaPdApng"
  }
];
const mockSystemLayers = [
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_19",
    layerNumber: 1,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300190_Rubber_sheat"
      }
    ],
    name: "SName 1",
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_20",
    layerNumber: 2,
    name: "SName 2",
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300191_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_21",
    name: "SName 3",
    layerNumber: 3,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300191_Rubber_sheat"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_22",
    name: "SName 4",
    layerNumber: 4,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300190_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_23",
    name: "SName 5",
    layerNumber: 5,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300190_Rubber_sheat"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_24",
    name: "SName 6",
    layerNumber: 6,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300191_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_25",
    name: "SName 7",
    layerNumber: 7,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300191_Rubber_sheat"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_26",
    name: "SName 8",
    layerNumber: 8,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300190_Rubber_sheat"
      },
      {
        code: "300191_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_27",
    name: "SName 9",
    layerNumber: 9,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300191_Rubber_sheat"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_28",
    name: "SName 10",
    layerNumber: 10,
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300190_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_29",
    layerNumber: 11,
    name: "SName 11",
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    products: [
      {
        code: "300190_Rubber_sheat"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  },
  {
    addon: false,
    approvalStatus: "approved",
    code: "Layer_30",
    layerNumber: 12,
    name: "SName 12",
    longDescription: "Long Dec System 2 NO",
    optionalProducts: [
      {
        code: "300191_Rubber_sheat"
      },
      {
        code: "300190_Rubber_sheat"
      }
    ],
    products: [
      {
        code: "400120_Monarplan_Outside_corner_anthracite"
      }
    ],
    shortDescription: "SDescription 1 NO",
    type: "LAYER_ACCESSORIES"
  }
];

const createSystemDetails = (system?: Partial<System>): System => ({
  type: "systemWsDTO",
  approvalStatus: "approved" as ApprovalStatus,
  categories: [
    {
      categoryType: "Brand",
      code: "MONARFLEX",
      name: "Monarflex"
    },
    {
      categoryType: "ProductFamily",
      code: "SOLAR_PV_PREMIUM",
      name: "Solar PV Premium",
      parentCategoryCode: "PRODUCT_FAMILY"
    },
    {
      categoryType: "SystemType",
      code: "SYSTEM_TYPES",
      name: "System Types",
      parentCategoryCode: ""
    }
  ],
  classifications: [
    {
      code: ClassificationCodeEnum.SYSTEM_ATTRIBUTES,
      features: [
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup",
          featureValues: [
            {
              value: "Yes"
            }
          ],
          name: "Roof build-up"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent",
          featureValues: [
            {
              value: "Promotional Content Value"
            }
          ],
          name: "Promotional Content"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.uniquesellingpropositions",
          featureValues: [
            {
              value: "Value 1"
            },
            {
              value: "Value 2"
            }
          ],
          name: "Unique Selling Propositions"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.uniquesellingpropositions",
          featureValues: [
            {
              value: "Value 1"
            },
            {
              value: "Value 2"
            }
          ],
          name: "Unique Selling Propositions"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures",
          featureValues: [
            {
              value: "Value 1"
            },
            {
              value: "Value 2"
            }
          ],
          name: "Key Features"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures",
          featureValues: [
            {
              value: "Value 1"
            },
            {
              value: "Value 2"
            }
          ],
          name: "Key Features"
        }
      ],
      name: ClassificationCodeEnum.SYSTEM_ATTRIBUTES
    },
    {
      code: ClassificationCodeEnum.FRANCE_FLAT_SYSTEM_ATTRIBUTES,
      features: [
        {
          code: "bmiSystemsClassificationCatalog/1.0/franceFlatSystemAttributes.brooft3_classification",
          featureValues: [
            {
              value: "44"
            }
          ],
          name: "Brooft3 classification"
        }
      ],
      name: ClassificationCodeEnum.FRANCE_FLAT_SYSTEM_ATTRIBUTES
    },
    {
      code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
      features: [
        {
          code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
          featureValues: [
            {
              value: "2"
            }
          ],
          name: "Scoring Weight"
        }
      ],
      name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
    },
    {
      code: ClassificationCodeEnum.MEASUREMENTS,
      features: [
        {
          code: "bmiSystemsClassificationCatalog/1.0/Measurements.width",
          featureUnit: {
            name: "millimeter",
            symbol: "mm",
            unitType: "space"
          },
          featureValues: [
            {
              value: "33"
            }
          ],
          name: "Width NO"
        },
        {
          code: "bmiSystemsClassificationCatalog/1.0/Measurements.length",
          featureUnit: {
            name: "centimeter",
            symbol: "cm",
            unitType: "space"
          },
          featureValues: [
            {
              value: "22"
            }
          ],
          name: "Length NO"
        }
      ],
      name: ClassificationCodeEnum.MEASUREMENTS
    }
  ],
  code: "Test_PIM_System1",
  longDescription: "Long Dec System 2 NO",
  name: "NO System 1",
  shortDescription: "SDescription 1 NO",
  systemBenefits: ["Benefit 3 NO, Benefit 4 NO"],
  systemReferences: [
    {
      referenceType: "CROSSELLING",
      target: {
        code: "Test_PIM_System2",
        name: "NO System 1"
      },
      preselected: true
    },
    {
      referenceType: "CROSSELLING",
      target: {
        code: "Test_PIM_System3",
        name: "NO System 3"
      },
      preselected: true
    }
  ],
  assets: mockAssets.map((asset) => ({
    ...asset,
    assetType: asset.assetType as AssetAssetType,
    mime: asset.mime as Mime
  })),
  images: mockImages.map((image) => ({
    ...image,
    format: image.format as ImageFormat,
    mime: image.mime as ImageMime
  })),
  systemLayers: mockSystemLayers.map((layer) => ({
    ...layer,
    approvalStatus: layer.approvalStatus as ApprovalStatus,
    relatedProducts: [
      createBaseProduct({
        name: "Zanda Protector normalstein",
        variantOptions: [
          createVariantOption({
            path: "p/zanda-protector-normalstein/svart/935895622/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/rød/619975412/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          })
        ]
      })
    ],
    relatedOptionalProducts: [
      createBaseProduct({
        name: "Zanda Protector normalstein",
        variantOptions: [
          createVariantOption({
            path: "p/zanda-protector-normalstein/svart/935895622/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/rød/619975412/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          })
        ]
      })
    ]
  })),
  ...system
});
export default createSystemDetails;
