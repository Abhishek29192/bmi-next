import createProduct from "../../__tests__/helpers/ProductHelper";
import { Product } from "../../types/pim";
import { createSchemaOrgDataForPdpPage } from "../schemaOrgPDPpage";

describe("createSchemaOrgDataForPdpPage", () => {
  it("should return minimal information for SchemaOrg", () => {
    const siteUrl = "http://bmigroup.com";
    const product: Product = {
      approvalStatus: "approved",
      awardsAndCertificateDocuments: [],
      awardsAndCertificateImages: [],
      baseCode: "base-code",
      baseScoringWeight: 0,
      bimIframeUrl: null,
      brand: null,
      categories: [],
      classifications: [],
      code: "code",
      colour: null,
      colourMicrocopy: undefined,
      colourFamily: null,
      description: "description",
      documents: [],
      externalProductCode: null,
      filters: [],
      fixingToolIframeUrl: null,
      galleryImages: [],
      groups: [],
      guaranteesAndWarrantiesImages: [],
      guaranteesAndWarrantiesLinks: [],
      masterImage: null,
      hashedCode: "id",
      isSampleOrderAllowed: false,
      materials: null,
      measurements: null,
      name: "name",
      productBenefits: null,
      relatedVariants: [],
      specificationIframeUrl: null,
      techDrawings: [],
      textureFamily: null,
      textureFamilyMicrocopy: undefined,
      variantAttribute: null,
      videos: [],
      weight: null,
      __typename: "Product",
      breadcrumbs: [],
      keyAssetDocuments: [],
      oldPath: "/old-path",
      path: "/p/some-product-path",
      relatedProducts: [],
      productDocuments: [],
      isVisualiserAvailable: false
    };

    const result = createSchemaOrgDataForPdpPage(siteUrl, product, "no");

    expect(result).toEqual({
      "@type": "Product",
      award: undefined,
      brand: undefined,
      color: undefined,
      description: "description",
      height: undefined,
      image: undefined,
      logo: undefined,
      material: undefined,
      model: "name",
      name: "name",
      pattern: undefined,
      potentialAction: undefined,
      productID: "code",
      size: undefined,
      url: "http://bmigroup.com/no/p/some-product-path/",
      weight: undefined,
      width: undefined
    });
  });

  it("should return all information for schemaOrg if all data exists", () => {
    const siteUrl = "http://bmigroup.com";
    const product: Product = createProduct();

    const result = createSchemaOrgDataForPdpPage(siteUrl, product, "no");

    expect(result).toEqual({
      "@type": "Product",
      award: "asset-name",
      brand: {
        "@type": "Brand",
        name: "brand-name"
      },
      color: "colour",
      description: "Description",
      height: {
        "@type": "QuantitativeValue",
        value: "8",
        valueReference: "symbol"
      },
      image: "http://localhost:8000/image-main-source.jpg",
      logo: "http://brand-logo",
      material: "Materials",
      model: "Name",
      name: "Name",
      pattern: "texture-family",
      productID: "code",
      size: "10symbol",
      url: "http://bmigroup.com/no/p/path/",
      weight: {
        "@type": "QuantitativeValue",
        value: "9",
        valueReference: "symbol"
      },
      width: {
        "@type": "QuantitativeValue",
        value: "7",
        valueReference: "symbol"
      }
    });
  });
});
