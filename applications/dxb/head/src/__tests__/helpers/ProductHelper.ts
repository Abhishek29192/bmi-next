import { Product } from "../../types/pim";
import createAsset, { createImageAsset, createLinkAsset } from "./AssetHelper";
import createAssetType from "./AssetTypeHelper";
import createBrand from "./BrandHelper";
import createBreadcrumbItem from "./BreadcrumbItemHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import createImage from "./ImageHelper";
import createMeasurements from "./MeasurementsHelper";
import createPimDocument from "./PimDocumentHelper";
import createFilter from "./PimFilter";
import createRelatedProduct from "./RelatedProductHelper";
import createRelatedVariant from "./RelatedVariantHelper";
import createVideo from "./VideoHelper";
import createWeight from "./WeightHelper";

export const createProduct = (product?: Partial<Product>): Product => ({
  awardsAndCertificateDocuments: [
    createAsset({ assetType: "AWARDS" }),
    createAsset({ assetType: "CERTIFICATES" })
  ],
  awardsAndCertificateImages: [
    createImageAsset({
      assetType: "AWARDS"
    }),
    createImageAsset({ assetType: "CERTIFICATES" })
  ],
  baseCode: "base-code",
  baseScoringWeight: 100,
  bimIframeUrl: "http://bimIframUrl",
  brand: createBrand(),
  categories: [createCategory()],
  classifications: [createClassification()],
  code: "code",
  colour: "colour",
  colourMicrocopy: "Colour",
  colourFamily: "colour fmaily",
  description: "Description",
  documents: [],
  productDocuments: [
    createPimDocument({
      id: "id-1",
      assetType: createAssetType({ pimCode: "ASSEMBLY_INSTRUCTIONS" })
    }),
    createPimDocument({
      id: "id-2",
      assetType: createAssetType({ pimCode: "ASSEMBLY_INSTRUCTIONS" })
    }),
    createPimDocument({
      id: "id-3",
      assetType: createAssetType({ pimCode: "AWARDS" })
    }),
    createPimDocument({
      id: "id-3",
      assetType: createAssetType({ pimCode: "TECHNICAL_DRAWINGS" })
    })
  ],
  externalProductCode: "external-product-code",
  filters: [createFilter()],
  fixingToolIframeUrl: "http://fixingToolIframeUrl",
  galleryImages: [createImage()],
  groups: [{ label: "group-label", code: "group-code" }],
  guaranteesAndWarrantiesImages: [
    createImageAsset(),
    createImageAsset({ assetType: "WARRANTIES" })
  ],
  guaranteesAndWarrantiesLinks: [
    createLinkAsset({ assetType: "GUARANTIES" }),
    createLinkAsset({ assetType: "WARRANTIES" })
  ],
  masterImages: [createImage()],
  hashedCode: "id",
  isSampleOrderAllowed: true,
  materials: "Materials",
  measurements: createMeasurements(),
  name: "Name",
  productBenefits: ["product-benefit"],
  relatedVariants: [createRelatedVariant()],
  specificationIframeUrl: "http://specificationIframeUrl",
  techDrawings: [createImage()],
  textureFamily: "texture-family",
  textureFamilyMicrocopy: "Texture Family",
  variantAttribute: "variant-attribute",
  videos: [createVideo()],
  weight: createWeight(),
  __typename: "Product",
  breadcrumbs: [createBreadcrumbItem()],
  keyAssetDocuments: [{ assetType: "PIM", documents: [createPimDocument()] }],
  oldPath: "/p/old/path",
  path: "/p/path",
  relatedProducts: [createRelatedProduct()],
  ...product
});

export default createProduct;
