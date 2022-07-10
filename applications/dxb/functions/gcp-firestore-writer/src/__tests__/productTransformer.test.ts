import {
  createAsset,
  createCategory,
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createFullyPopulatedProduct,
  createFullyPopulatedVariantOption,
  createIgnorableClassifications,
  createImage,
  createProduct,
  createVariantOption,
  Product
} from "@bmi/pim-types";

jest.mock("@bmi-digital/functions-logger");

const transformProducts = async (products: Product[]) =>
  (await import("../productTransformer")).transformProducts(products);

beforeEach(() => {
  process.env.ENABLE_SAMPLE_ORDERING = "true";
});

describe("transformProducts", () => {
  it("transforms a product with no variants", async () => {
    const products: Product[] = [createProduct({ variantOptions: undefined })];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toEqual([]);
  });

  it("transforms a single variant option with minimal data", async () => {
    const products: Product[] = [
      {
        approvalStatus: "approved",
        code: "code",
        externalProductCode: undefined,
        description: "description",
        assets: undefined,
        categories: undefined,
        classifications: undefined,
        images: undefined,
        isSampleOrderAllowed: undefined,
        longDescription: "long description",
        name: "name",
        productBenefits: undefined,
        shortDescription: "short description",
        summary: "summary",
        variantOptions: [
          {
            approvalStatus: "approved",
            classifications: undefined,
            code: "variant-code",
            externalProductCode: undefined,
            images: undefined,
            isSampleOrderAllowed: undefined,
            longDescription: undefined,
            shortDescription: "variant short description",
            productBenefits: undefined
          }
        ]
      }
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toEqual([
      {
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        baseCode: products[0].code,
        baseScoringWeight: 0,
        bimIframeUrl: undefined,
        brand: undefined,
        categories: [],
        classifications: [],
        code: products[0].variantOptions![0].code,
        colour: undefined,
        colourMicrocopy: undefined,
        colourFamily: undefined,
        documents: [],
        description: products[0].description,
        externalProductCode: undefined,
        filters: [],
        fixingToolIframeUrl: undefined,
        galleryImages: [],
        groups: [],
        hashedCode: "3464354221",
        isSampleOrderAllowed: false,
        masterImages: [],
        materials: undefined,
        measurements: {
          length: undefined,
          width: undefined,
          height: undefined,
          thickness: undefined,
          volume: undefined,
          label: ""
        },
        name: products[0].name,
        path: `/p/${products[0].name}-3464354221`,
        productBenefits: undefined,
        relatedVariants: [],
        specificationIframeUrl: undefined,
        techDrawings: [],
        textureFamily: undefined,
        textureFamilyMicrocopy: undefined,
        variantAttribute: undefined,
        videos: [],
        weight: {
          grossWeight: undefined,
          netWeight: undefined,
          weightPerPallet: undefined,
          weightPerPiece: undefined,
          weightPerSqm: undefined
        }
      }
    ]);
  });

  it("transforms a fully populated product", async () => {
    const products = [createFullyPopulatedProduct()];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toMatchInlineSnapshot(`
      Array [
        Object {
          "awardsAndCertificateDocuments": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": undefined,
            },
          ],
          "awardsAndCertificateImages": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
          ],
          "baseCode": "base-code",
          "baseScoringWeight": 100,
          "bimIframeUrl": "http://localhost:8000",
          "brand": Object {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": Array [
            Object {
              "categoryType": "Brand",
              "code": "code",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "name",
              "parentCategoryCode": "parent-category-code",
            },
            Object {
              "categoryType": "Category",
              "code": "parent-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Parent Category",
              "parentCategoryCode": "",
            },
            Object {
              "categoryType": "Category",
              "code": "child-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Child Category",
              "parentCategoryCode": "parent-category",
            },
          ],
          "classifications": Array [
            Object {
              "features": Array [
                Object {
                  "name": "Material",
                  "value": "Concrete",
                },
              ],
              "name": "General",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Length",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Width",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Height",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Thickness",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Volume",
                  "value": "10 symbol",
                },
              ],
              "name": "Measurements",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Gross Weight",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Net Weight",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Weight per Pallet",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Weight per Piece",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Weight per sq m",
                  "value": "10 symbol",
                },
              ],
              "name": "Weight",
            },
            Object {
              "features": Array [
                Object {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "variant-code",
          "colour": "Shadow Black",
          "colourFamily": "Black",
          "colourMicrocopy": "Colour",
          "description": "<p>Long description</p>",
          "documents": Array [
            Object {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "AWARDS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "BIM",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "FIXING_TOOL",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "GUARANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
            Object {
              "assetType": "WARRANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
          ],
          "externalProductCode": "external-product-code",
          "filters": Array [
            Object {
              "code": "code",
              "filterCode": "classification-feature-code",
              "groupLabel": "name",
              "isCategory": false,
              "name": "name",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "value",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colour",
              "groupLabel": "Colour",
              "isCategory": false,
              "name": "Colour",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colourfamily",
              "groupLabel": "Colour Family",
              "isCategory": false,
              "name": "Colour Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.texturefamily",
              "groupLabel": "Texture Family",
              "isCategory": false,
              "name": "Texture Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Gloss",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.variantattribute",
              "groupLabel": "Variant Attribute",
              "isCategory": false,
              "name": "Variant Attribute",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black Gloss 6x7x8x9x10",
            },
            Object {
              "code": "code",
              "filterCode": "generalInformation.materials",
              "groupLabel": "Material",
              "isCategory": false,
              "name": "Material",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Concrete",
            },
            Object {
              "code": "",
              "filterCode": "measurements.length",
              "groupLabel": "Length",
              "isCategory": false,
              "name": "Length",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "measurements.width",
              "groupLabel": "Width",
              "isCategory": false,
              "name": "Width",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "measurements.height",
              "groupLabel": "Height",
              "isCategory": false,
              "name": "Height",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "measurements.thickness",
              "groupLabel": "Thickness",
              "isCategory": false,
              "name": "Thickness",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "measurements.volume",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.grossweight",
              "groupLabel": "Gross Weight",
              "isCategory": false,
              "name": "Gross Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.netweight",
              "groupLabel": "Net Weight",
              "isCategory": false,
              "name": "Net Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpallet",
              "groupLabel": "Weight per Pallet",
              "isCategory": false,
              "name": "Weight per Pallet",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpiece",
              "groupLabel": "Weight per Piece",
              "isCategory": false,
              "name": "Weight per Piece",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightpersqm",
              "groupLabel": "Weight per sq m",
              "isCategory": false,
              "name": "Weight per sq m",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "code",
              "filterCode": "Brand",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "name",
              "parentFilterCode": "parent-category-code",
              "value": "code",
            },
            Object {
              "code": "parent-category",
              "filterCode": "Category",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "Parent Category",
              "parentFilterCode": "",
              "value": "parent-category",
            },
            Object {
              "code": "child-category",
              "filterCode": "Category",
              "groupLabel": "Parent Category",
              "isCategory": true,
              "name": "Child Category",
              "parentFilterCode": "parent-category",
              "value": "child-category",
            },
          ],
          "fixingToolIframeUrl": "http://localhost:8000",
          "galleryImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "groups": Array [
            Object {
              "code": "parent-category",
              "label": "Parent Category",
            },
          ],
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "3464354221",
          "isSampleOrderAllowed": true,
          "masterImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "materials": "Concrete",
          "measurements": Object {
            "height": Object {
              "unit": "symbol",
              "value": "8",
            },
            "label": "6x7x8symbol",
            "length": Object {
              "unit": "symbol",
              "value": "6",
            },
            "thickness": Object {
              "unit": "symbol",
              "value": "9",
            },
            "volume": Object {
              "unit": "symbol",
              "value": "10",
            },
            "width": Object {
              "unit": "symbol",
              "value": "7",
            },
          },
          "name": "name",
          "path": "/p/name-shadow-black-gloss-concrete-3464354221",
          "productBenefits": Array [
            "product-benefits",
          ],
          "relatedVariants": Array [],
          "specificationIframeUrl": "http://localhost:8000",
          "techDrawings": Array [
            Object {
              "altText": undefined,
              "mainSource": "http://localhost:8000",
              "thumbnail": undefined,
            },
          ],
          "textureFamily": "Gloss",
          "textureFamilyMicrocopy": "Texture Family",
          "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
          "videos": Array [
            Object {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "youtubeId": "3901c0ds7oo",
            },
          ],
          "weight": Object {
            "grossWeight": Object {
              "unit": "symbol",
              "value": "6",
            },
            "netWeight": Object {
              "unit": "symbol",
              "value": "7",
            },
            "weightPerPallet": Object {
              "unit": "symbol",
              "value": "8",
            },
            "weightPerPiece": Object {
              "unit": "symbol",
              "value": "9",
            },
            "weightPerSqm": Object {
              "unit": "symbol",
              "value": "10",
            },
          },
        },
      ]
    `);
  });

  it("transforms a fully populated product with unit of measurement symbols", async () => {
    const product = createFullyPopulatedProduct();
    const classification2 = createClassification({
      features: undefined
    });
    const classification1 = createClassification({
      code: "measurements",
      name: "Measurements",
      features: [
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.length",
          name: "Length",
          featureValues: [createFeatureValue({ code: undefined, value: "1" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.width",
          name: "width",
          featureValues: [createFeatureValue({ code: undefined, value: "2" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.height",
          name: "Height",
          featureValues: [createFeatureValue({ code: undefined, value: "3" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.thickness",
          name: "Thickness",
          featureValues: [createFeatureValue({ code: undefined, value: "4" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.volume",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.grossweight",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.netweight",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.weightperpallet",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: undefined
        })
      ]
    });
    product.classifications = [classification1, classification2];
    const products = [product];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toMatchInlineSnapshot(`
      Array [
        Object {
          "awardsAndCertificateDocuments": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": undefined,
            },
          ],
          "awardsAndCertificateImages": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
          ],
          "baseCode": "base-code",
          "baseScoringWeight": 0,
          "bimIframeUrl": "http://localhost:8000",
          "brand": Object {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": Array [
            Object {
              "categoryType": "Brand",
              "code": "code",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "name",
              "parentCategoryCode": "parent-category-code",
            },
            Object {
              "categoryType": "Category",
              "code": "parent-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Parent Category",
              "parentCategoryCode": "",
            },
            Object {
              "categoryType": "Category",
              "code": "child-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Child Category",
              "parentCategoryCode": "parent-category",
            },
          ],
          "classifications": Array [
            Object {
              "features": Array [
                Object {
                  "name": "Material",
                  "value": "Concrete",
                },
              ],
              "name": "General",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Length",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Width",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Height",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Thickness",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Volume",
                  "value": "10 symbol",
                },
                Object {
                  "name": "Volume",
                  "value": "5 mm",
                },
                Object {
                  "name": "Volume",
                  "value": "5 mm",
                },
                Object {
                  "name": "Volume",
                  "value": "5",
                },
              ],
              "name": "Measurements",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Gross Weight",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Net Weight",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Weight per Pallet",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Weight per Piece",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Weight per sq m",
                  "value": "10 symbol",
                },
              ],
              "name": "Weight",
            },
            Object {
              "features": Array [
                Object {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "variant-code",
          "colour": "Shadow Black",
          "colourFamily": "Black",
          "colourMicrocopy": "Colour",
          "description": "<p>Long description</p>",
          "documents": Array [
            Object {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "AWARDS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "BIM",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "FIXING_TOOL",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "GUARANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
            Object {
              "assetType": "WARRANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
          ],
          "externalProductCode": "external-product-code",
          "filters": Array [
            Object {
              "code": "code",
              "filterCode": "classification-feature-code",
              "groupLabel": "name",
              "isCategory": false,
              "name": "name",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "value",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colour",
              "groupLabel": "Colour",
              "isCategory": false,
              "name": "Colour",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colourfamily",
              "groupLabel": "Colour Family",
              "isCategory": false,
              "name": "Colour Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.texturefamily",
              "groupLabel": "Texture Family",
              "isCategory": false,
              "name": "Texture Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Gloss",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.variantattribute",
              "groupLabel": "Variant Attribute",
              "isCategory": false,
              "name": "Variant Attribute",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black Gloss 6x7x8x9x10",
            },
            Object {
              "code": "code",
              "filterCode": "generalInformation.materials",
              "groupLabel": "Material",
              "isCategory": false,
              "name": "Material",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Concrete",
            },
            Object {
              "code": "",
              "filterCode": "measurements.length",
              "groupLabel": "Length",
              "isCategory": false,
              "name": "Length",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "measurements.width",
              "groupLabel": "Width",
              "isCategory": false,
              "name": "Width",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "measurements.height",
              "groupLabel": "Height",
              "isCategory": false,
              "name": "Height",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "measurements.thickness",
              "groupLabel": "Thickness",
              "isCategory": false,
              "name": "Thickness",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "measurements.volume",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "",
              "filterCode": "measurements.grossweight",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "mm",
              "value": "5",
            },
            Object {
              "code": "",
              "filterCode": "measurements.netweight",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "mm",
              "value": "5",
            },
            Object {
              "code": "",
              "filterCode": "measurements.weightperpallet",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "5",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.grossweight",
              "groupLabel": "Gross Weight",
              "isCategory": false,
              "name": "Gross Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.netweight",
              "groupLabel": "Net Weight",
              "isCategory": false,
              "name": "Net Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpallet",
              "groupLabel": "Weight per Pallet",
              "isCategory": false,
              "name": "Weight per Pallet",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpiece",
              "groupLabel": "Weight per Piece",
              "isCategory": false,
              "name": "Weight per Piece",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightpersqm",
              "groupLabel": "Weight per sq m",
              "isCategory": false,
              "name": "Weight per sq m",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "code",
              "filterCode": "Brand",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "name",
              "parentFilterCode": "parent-category-code",
              "value": "code",
            },
            Object {
              "code": "parent-category",
              "filterCode": "Category",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "Parent Category",
              "parentFilterCode": "",
              "value": "parent-category",
            },
            Object {
              "code": "child-category",
              "filterCode": "Category",
              "groupLabel": "Parent Category",
              "isCategory": true,
              "name": "Child Category",
              "parentFilterCode": "parent-category",
              "value": "child-category",
            },
          ],
          "fixingToolIframeUrl": "http://localhost:8000",
          "galleryImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "groups": Array [
            Object {
              "code": "parent-category",
              "label": "Parent Category",
            },
          ],
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "3464354221",
          "isSampleOrderAllowed": true,
          "masterImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "materials": "Concrete",
          "measurements": Object {
            "height": Object {
              "unit": "symbol",
              "value": "8",
            },
            "label": "6x7x8symbol",
            "length": Object {
              "unit": "symbol",
              "value": "6",
            },
            "thickness": Object {
              "unit": "symbol",
              "value": "9",
            },
            "volume": Object {
              "unit": "symbol",
              "value": "10",
            },
            "width": Object {
              "unit": "symbol",
              "value": "7",
            },
          },
          "name": "name",
          "path": "/p/name-shadow-black-gloss-concrete-3464354221",
          "productBenefits": Array [
            "product-benefits",
          ],
          "relatedVariants": Array [],
          "specificationIframeUrl": "http://localhost:8000",
          "techDrawings": Array [
            Object {
              "altText": undefined,
              "mainSource": "http://localhost:8000",
              "thumbnail": undefined,
            },
          ],
          "textureFamily": "Gloss",
          "textureFamilyMicrocopy": "Texture Family",
          "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
          "videos": Array [
            Object {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "youtubeId": "3901c0ds7oo",
            },
          ],
          "weight": Object {
            "grossWeight": Object {
              "unit": "symbol",
              "value": "6",
            },
            "netWeight": Object {
              "unit": "symbol",
              "value": "7",
            },
            "weightPerPallet": Object {
              "unit": "symbol",
              "value": "8",
            },
            "weightPerPiece": Object {
              "unit": "symbol",
              "value": "9",
            },
            "weightPerSqm": Object {
              "unit": "symbol",
              "value": "10",
            },
          },
        },
      ]
    `);
  });

  it("transforms a product with multiple variant options into multiple products", async () => {
    const products = [
      createFullyPopulatedProduct([
        createFullyPopulatedVariantOption({ code: "variant1" }),
        createFullyPopulatedVariantOption({ code: "variant2" })
      ])
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toMatchInlineSnapshot(`
      Array [
        Object {
          "awardsAndCertificateDocuments": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": undefined,
            },
          ],
          "awardsAndCertificateImages": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
          ],
          "baseCode": "base-code",
          "baseScoringWeight": 100,
          "bimIframeUrl": "http://localhost:8000",
          "brand": Object {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": Array [
            Object {
              "categoryType": "Brand",
              "code": "code",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "name",
              "parentCategoryCode": "parent-category-code",
            },
            Object {
              "categoryType": "Category",
              "code": "parent-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Parent Category",
              "parentCategoryCode": "",
            },
            Object {
              "categoryType": "Category",
              "code": "child-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Child Category",
              "parentCategoryCode": "parent-category",
            },
          ],
          "classifications": Array [
            Object {
              "features": Array [
                Object {
                  "name": "Colour",
                  "value": "Shadow Black",
                },
                Object {
                  "name": "Texture Family",
                  "value": "Gloss",
                },
                Object {
                  "name": "Variant Attribute",
                  "value": "Shadow Black Gloss 6x7x8x9x10",
                },
              ],
              "name": "Appearance",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Material",
                  "value": "Concrete",
                },
              ],
              "name": "General",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Length",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Width",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Height",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Thickness",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Volume",
                  "value": "10 symbol",
                },
              ],
              "name": "Measurements",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Gross Weight",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Net Weight",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Weight per Pallet",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Weight per Piece",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Weight per sq m",
                  "value": "10 symbol",
                },
              ],
              "name": "Weight",
            },
            Object {
              "features": Array [
                Object {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "variant1",
          "colour": "Shadow Black",
          "colourFamily": "Black",
          "colourMicrocopy": "Colour",
          "description": "<p>Long description</p>",
          "documents": Array [
            Object {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "AWARDS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "BIM",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "FIXING_TOOL",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "GUARANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
            Object {
              "assetType": "WARRANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
          ],
          "externalProductCode": "external-product-code",
          "filters": Array [
            Object {
              "code": "code",
              "filterCode": "classification-feature-code",
              "groupLabel": "name",
              "isCategory": false,
              "name": "name",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "value",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colour",
              "groupLabel": "Colour",
              "isCategory": false,
              "name": "Colour",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colourfamily",
              "groupLabel": "Colour Family",
              "isCategory": false,
              "name": "Colour Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.texturefamily",
              "groupLabel": "Texture Family",
              "isCategory": false,
              "name": "Texture Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Gloss",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.variantattribute",
              "groupLabel": "Variant Attribute",
              "isCategory": false,
              "name": "Variant Attribute",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black Gloss 6x7x8x9x10",
            },
            Object {
              "code": "code",
              "filterCode": "generalInformation.materials",
              "groupLabel": "Material",
              "isCategory": false,
              "name": "Material",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Concrete",
            },
            Object {
              "code": "",
              "filterCode": "measurements.length",
              "groupLabel": "Length",
              "isCategory": false,
              "name": "Length",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "measurements.width",
              "groupLabel": "Width",
              "isCategory": false,
              "name": "Width",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "measurements.height",
              "groupLabel": "Height",
              "isCategory": false,
              "name": "Height",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "measurements.thickness",
              "groupLabel": "Thickness",
              "isCategory": false,
              "name": "Thickness",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "measurements.volume",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.grossweight",
              "groupLabel": "Gross Weight",
              "isCategory": false,
              "name": "Gross Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.netweight",
              "groupLabel": "Net Weight",
              "isCategory": false,
              "name": "Net Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpallet",
              "groupLabel": "Weight per Pallet",
              "isCategory": false,
              "name": "Weight per Pallet",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpiece",
              "groupLabel": "Weight per Piece",
              "isCategory": false,
              "name": "Weight per Piece",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightpersqm",
              "groupLabel": "Weight per sq m",
              "isCategory": false,
              "name": "Weight per sq m",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "code",
              "filterCode": "Brand",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "name",
              "parentFilterCode": "parent-category-code",
              "value": "code",
            },
            Object {
              "code": "parent-category",
              "filterCode": "Category",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "Parent Category",
              "parentFilterCode": "",
              "value": "parent-category",
            },
            Object {
              "code": "child-category",
              "filterCode": "Category",
              "groupLabel": "Parent Category",
              "isCategory": true,
              "name": "Child Category",
              "parentFilterCode": "parent-category",
              "value": "child-category",
            },
          ],
          "fixingToolIframeUrl": "http://localhost:8000",
          "galleryImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "groups": Array [
            Object {
              "code": "parent-category",
              "label": "Parent Category",
            },
          ],
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "3903870044",
          "isSampleOrderAllowed": true,
          "masterImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "materials": "Concrete",
          "measurements": Object {
            "height": Object {
              "unit": "symbol",
              "value": "8",
            },
            "label": "6x7x8symbol",
            "length": Object {
              "unit": "symbol",
              "value": "6",
            },
            "thickness": Object {
              "unit": "symbol",
              "value": "9",
            },
            "volume": Object {
              "unit": "symbol",
              "value": "10",
            },
            "width": Object {
              "unit": "symbol",
              "value": "7",
            },
          },
          "name": "name",
          "path": "/p/name-shadow-black-gloss-concrete-3903870044",
          "productBenefits": Array [
            "product-benefits",
          ],
          "relatedVariants": Array [
            Object {
              "code": "variant2",
              "colour": "Shadow Black",
              "colourFamily": "Black",
              "hashedCode": "2671178359",
              "materials": "Concrete",
              "measurements": Object {
                "height": Object {
                  "unit": "symbol",
                  "value": "8",
                },
                "label": "6x7x8symbol",
                "length": Object {
                  "unit": "symbol",
                  "value": "6",
                },
                "thickness": Object {
                  "unit": "symbol",
                  "value": "9",
                },
                "volume": Object {
                  "unit": "symbol",
                  "value": "10",
                },
                "width": Object {
                  "unit": "symbol",
                  "value": "7",
                },
              },
              "name": "name",
              "textureFamily": "Gloss",
              "thumbnail": "http://localhost:8000",
              "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
            },
          ],
          "specificationIframeUrl": "http://localhost:8000",
          "techDrawings": Array [
            Object {
              "altText": undefined,
              "mainSource": "http://localhost:8000",
              "thumbnail": undefined,
            },
          ],
          "textureFamily": "Gloss",
          "textureFamilyMicrocopy": "Texture Family",
          "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
          "videos": Array [
            Object {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "youtubeId": "3901c0ds7oo",
            },
          ],
          "weight": Object {
            "grossWeight": Object {
              "unit": "symbol",
              "value": "6",
            },
            "netWeight": Object {
              "unit": "symbol",
              "value": "7",
            },
            "weightPerPallet": Object {
              "unit": "symbol",
              "value": "8",
            },
            "weightPerPiece": Object {
              "unit": "symbol",
              "value": "9",
            },
            "weightPerSqm": Object {
              "unit": "symbol",
              "value": "10",
            },
          },
        },
        Object {
          "awardsAndCertificateDocuments": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": undefined,
            },
          ],
          "awardsAndCertificateImages": Array [
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            Object {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
          ],
          "baseCode": "base-code",
          "baseScoringWeight": 100,
          "bimIframeUrl": "http://localhost:8000",
          "brand": Object {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": Array [
            Object {
              "categoryType": "Brand",
              "code": "code",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "name",
              "parentCategoryCode": "parent-category-code",
            },
            Object {
              "categoryType": "Category",
              "code": "parent-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Parent Category",
              "parentCategoryCode": "",
            },
            Object {
              "categoryType": "Category",
              "code": "child-category",
              "image": Object {
                "allowedToDownload": true,
                "fileSize": 10,
                "mime": "image/png",
                "name": "name",
                "realFileName": "real-file-name.png",
                "url": "http://localhost:8000",
              },
              "name": "Child Category",
              "parentCategoryCode": "parent-category",
            },
          ],
          "classifications": Array [
            Object {
              "features": Array [
                Object {
                  "name": "Colour",
                  "value": "Shadow Black",
                },
                Object {
                  "name": "Texture Family",
                  "value": "Gloss",
                },
                Object {
                  "name": "Variant Attribute",
                  "value": "Shadow Black Gloss 6x7x8x9x10",
                },
              ],
              "name": "Appearance",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Material",
                  "value": "Concrete",
                },
              ],
              "name": "General",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Length",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Width",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Height",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Thickness",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Volume",
                  "value": "10 symbol",
                },
              ],
              "name": "Measurements",
            },
            Object {
              "features": Array [
                Object {
                  "name": "Gross Weight",
                  "value": "6 symbol",
                },
                Object {
                  "name": "Net Weight",
                  "value": "7 symbol",
                },
                Object {
                  "name": "Weight per Pallet",
                  "value": "8 symbol",
                },
                Object {
                  "name": "Weight per Piece",
                  "value": "9 symbol",
                },
                Object {
                  "name": "Weight per sq m",
                  "value": "10 symbol",
                },
              ],
              "name": "Weight",
            },
            Object {
              "features": Array [
                Object {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "variant2",
          "colour": "Shadow Black",
          "colourFamily": "Black",
          "colourMicrocopy": "Colour",
          "description": "<p>Long description</p>",
          "documents": Array [
            Object {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "AWARDS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "CERTIFICATES",
              "id": "2583923841",
              "isLinkDocument": true,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "BIM",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "FIXING_TOOL",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "GUARANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            Object {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
            Object {
              "assetType": "WARRANTIES",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "productBaseCode": "base-code",
              "productCategories": Array [
                Object {
                  "code": "code",
                  "parentCategoryCode": "parent-category-code",
                },
                Object {
                  "code": "parent-category",
                  "parentCategoryCode": "",
                },
                Object {
                  "code": "child-category",
                  "parentCategoryCode": "parent-category",
                },
              ],
              "productName": "name",
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
          ],
          "externalProductCode": "external-product-code",
          "filters": Array [
            Object {
              "code": "code",
              "filterCode": "classification-feature-code",
              "groupLabel": "name",
              "isCategory": false,
              "name": "name",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "value",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colour",
              "groupLabel": "Colour",
              "isCategory": false,
              "name": "Colour",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.colourfamily",
              "groupLabel": "Colour Family",
              "isCategory": false,
              "name": "Colour Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Black",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.texturefamily",
              "groupLabel": "Texture Family",
              "isCategory": false,
              "name": "Texture Family",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Gloss",
            },
            Object {
              "code": "code",
              "filterCode": "appearanceAttributes.variantattribute",
              "groupLabel": "Variant Attribute",
              "isCategory": false,
              "name": "Variant Attribute",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Shadow Black Gloss 6x7x8x9x10",
            },
            Object {
              "code": "code",
              "filterCode": "generalInformation.materials",
              "groupLabel": "Material",
              "isCategory": false,
              "name": "Material",
              "parentFilterCode": "",
              "unit": undefined,
              "value": "Concrete",
            },
            Object {
              "code": "",
              "filterCode": "measurements.length",
              "groupLabel": "Length",
              "isCategory": false,
              "name": "Length",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "measurements.width",
              "groupLabel": "Width",
              "isCategory": false,
              "name": "Width",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "measurements.height",
              "groupLabel": "Height",
              "isCategory": false,
              "name": "Height",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "measurements.thickness",
              "groupLabel": "Thickness",
              "isCategory": false,
              "name": "Thickness",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "measurements.volume",
              "groupLabel": "Volume",
              "isCategory": false,
              "name": "Volume",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.grossweight",
              "groupLabel": "Gross Weight",
              "isCategory": false,
              "name": "Gross Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "6",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.netweight",
              "groupLabel": "Net Weight",
              "isCategory": false,
              "name": "Net Weight",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "7",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpallet",
              "groupLabel": "Weight per Pallet",
              "isCategory": false,
              "name": "Weight per Pallet",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "8",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightperpiece",
              "groupLabel": "Weight per Piece",
              "isCategory": false,
              "name": "Weight per Piece",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "9",
            },
            Object {
              "code": "",
              "filterCode": "weightAttributes.weightpersqm",
              "groupLabel": "Weight per sq m",
              "isCategory": false,
              "name": "Weight per sq m",
              "parentFilterCode": "",
              "unit": "symbol",
              "value": "10",
            },
            Object {
              "code": "code",
              "filterCode": "Brand",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "name",
              "parentFilterCode": "parent-category-code",
              "value": "code",
            },
            Object {
              "code": "parent-category",
              "filterCode": "Category",
              "groupLabel": undefined,
              "isCategory": true,
              "name": "Parent Category",
              "parentFilterCode": "",
              "value": "parent-category",
            },
            Object {
              "code": "child-category",
              "filterCode": "Category",
              "groupLabel": "Parent Category",
              "isCategory": true,
              "name": "Child Category",
              "parentFilterCode": "parent-category",
              "value": "child-category",
            },
          ],
          "fixingToolIframeUrl": "http://localhost:8000",
          "galleryImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "groups": Array [
            Object {
              "code": "parent-category",
              "label": "Parent Category",
            },
          ],
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "2671178359",
          "isSampleOrderAllowed": true,
          "masterImages": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "materials": "Concrete",
          "measurements": Object {
            "height": Object {
              "unit": "symbol",
              "value": "8",
            },
            "label": "6x7x8symbol",
            "length": Object {
              "unit": "symbol",
              "value": "6",
            },
            "thickness": Object {
              "unit": "symbol",
              "value": "9",
            },
            "volume": Object {
              "unit": "symbol",
              "value": "10",
            },
            "width": Object {
              "unit": "symbol",
              "value": "7",
            },
          },
          "name": "name",
          "path": "/p/name-shadow-black-gloss-concrete-2671178359",
          "productBenefits": Array [
            "product-benefits",
          ],
          "relatedVariants": Array [
            Object {
              "code": "variant1",
              "colour": "Shadow Black",
              "colourFamily": "Black",
              "hashedCode": "3903870044",
              "materials": "Concrete",
              "measurements": Object {
                "height": Object {
                  "unit": "symbol",
                  "value": "8",
                },
                "label": "6x7x8symbol",
                "length": Object {
                  "unit": "symbol",
                  "value": "6",
                },
                "thickness": Object {
                  "unit": "symbol",
                  "value": "9",
                },
                "volume": Object {
                  "unit": "symbol",
                  "value": "10",
                },
                "width": Object {
                  "unit": "symbol",
                  "value": "7",
                },
              },
              "name": "name",
              "textureFamily": "Gloss",
              "thumbnail": "http://localhost:8000",
              "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
            },
          ],
          "specificationIframeUrl": "http://localhost:8000",
          "techDrawings": Array [
            Object {
              "altText": undefined,
              "mainSource": "http://localhost:8000",
              "thumbnail": undefined,
            },
          ],
          "textureFamily": "Gloss",
          "textureFamilyMicrocopy": "Texture Family",
          "variantAttribute": "Shadow Black Gloss 6x7x8x9x10",
          "videos": Array [
            Object {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "youtubeId": "3901c0ds7oo",
            },
          ],
          "weight": Object {
            "grossWeight": Object {
              "unit": "symbol",
              "value": "6",
            },
            "netWeight": Object {
              "unit": "symbol",
              "value": "7",
            },
            "weightPerPallet": Object {
              "unit": "symbol",
              "value": "8",
            },
            "weightPerPiece": Object {
              "unit": "symbol",
              "value": "9",
            },
            "weightPerSqm": Object {
              "unit": "symbol",
              "value": "10",
            },
          },
        },
      ]
    `);
  });

  it("ignores non-approved base products", async () => {
    const products = [
      createProduct({ variantOptions: [createVariantOption()] }),
      createProduct({
        approvalStatus: "check",
        variantOptions: [createVariantOption()]
      }),
      createProduct({
        approvalStatus: "unapproved",
        variantOptions: [createVariantOption()]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(1);
  });

  it("ignores non-approved variant options", async () => {
    const products = [
      createFullyPopulatedProduct([
        createFullyPopulatedVariantOption({ code: "variant1" }),
        createFullyPopulatedVariantOption({
          code: "variant2",
          approvalStatus: "check"
        }),
        createFullyPopulatedVariantOption({
          code: "variant3",
          approvalStatus: "unapproved"
        })
      ])
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].relatedVariants).toHaveLength(0);
  });

  it("handles a product with documents but no categories", async () => {
    const products: Product[] = [
      createProduct({ categories: undefined, assets: [createAsset()] })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].documents[0]).toEqual({
      assetType: "ASSEMBLY_INSTRUCTIONS",
      extension: "pdf",
      fileSize: 10,
      format: "application/pdf",
      id: "2583923841",
      isLinkDocument: false,
      productBaseCode: "base-code",
      productCategories: [],
      productName: "name",
      realFileName: "real-file-name.pdf",
      title: "name",
      url: "http://localhost:8000"
    });
  });

  it("uses only the base scoring weight, not the variant scoring weight", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "scoringWeightAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [createFeatureValue({ value: "100" })]
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                code: "scoringWeightAttributes",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                    featureValues: [createFeatureValue({ value: "50" })]
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].baseScoringWeight).toEqual(100);
  });

  it("overwrites base classification features with variant classification features of the same feature code", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            name: "base classification name",
            features: [
              createFeature({
                name: "base feature name",
                featureValues: [createFeatureValue({ value: "base value" })]
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                name: "variant classification name",
                features: [
                  createFeature({
                    name: "variant feature name",
                    featureValues: [
                      createFeatureValue({ value: "variant value" })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].classifications).toEqual([
      {
        name: "variant classification name",
        features: [
          {
            name: "variant feature name",
            value: "variant value symbol"
          }
        ]
      }
    ]);
  });

  it("handles classifications and features being only on either the base or variant", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "base-only",
            name: "base only classification name",
            features: [
              createFeature({
                code: "base-only-feature",
                name: "base only feature name"
              })
            ]
          }),
          createClassification({
            code: "both",
            name: "both base classification name",
            features: [
              createFeature({
                code: "base-feature"
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                code: "variant-only",
                name: "variant only classification name",
                features: [
                  createFeature({
                    code: "variant-only-feature",
                    name: "variant only feature name"
                  })
                ]
              }),
              createClassification({
                code: "both",
                name: "both variant classification name",
                features: [
                  createFeature({
                    code: "variant-feature",
                    name: "both variant feature name"
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].classifications).toEqual([
      {
        features: [
          {
            name: "base only feature name",
            value: "value symbol"
          }
        ],
        name: "base only classification name"
      },
      {
        features: [
          {
            name: "both variant feature name",
            value: "value symbol"
          },
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "both variant classification name"
      },
      {
        features: [
          {
            name: "variant only feature name",
            value: "value symbol"
          }
        ],
        name: "variant only classification name"
      }
    ]);
  });

  it("handles classifications not being present on the related variants", async () => {
    const products = [
      createProduct({
        classifications: undefined,
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: undefined
          }),
          createVariantOption({
            code: "variant2",
            classifications: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(2);
  });

  it("handles classifications without features", async () => {
    const products = [
      createProduct({
        classifications: [createClassification({ features: undefined })],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("handles classifications with empty list of features", async () => {
    const products = [
      createProduct({
        classifications: [createClassification({ features: [] })],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: []
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("handles classifications with feature filter codes without `/`", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            features: [createFeature({ code: "featureCodeWithoutSlash" })]
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "code",
        filterCode: "featureCodeWithoutSlash",
        groupLabel: "name",
        isCategory: false,
        name: "name",
        parentFilterCode: "",
        unit: "symbol",
        value: "value"
      },
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("use variant long description for description", async () => {
    const products = [
      createProduct({
        description: "base description",
        variantOptions: [
          createVariantOption({
            longDescription: "variant long description"
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].description).toEqual(
      "variant long description"
    );
  });

  it("use base description for description if variant long description is undefined", async () => {
    const products = [
      createProduct({
        description: "base description",
        variantOptions: [
          createVariantOption({
            longDescription: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].description).toEqual("base description");
  });

  it("set isSampleOrderAllowed to true if variant is true", async () => {
    const products = [
      createProduct({
        isSampleOrderAllowed: false,
        variantOptions: [
          createVariantOption({
            isSampleOrderAllowed: true
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(true);
  });

  it("set isSampleOrderAllowed to false if variant is false and base is true", async () => {
    const products = [
      createProduct({
        isSampleOrderAllowed: true,
        variantOptions: [
          createVariantOption({
            isSampleOrderAllowed: false
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is undefined and base is undefined", async () => {
    const products = [
      createProduct({
        isSampleOrderAllowed: undefined,
        variantOptions: [
          createVariantOption({
            isSampleOrderAllowed: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is true and base is true and ENABLE_SAMPLE_ORDERING is false", async () => {
    process.env.ENABLE_SAMPLE_ORDERING = "false";
    const products = [
      createProduct({
        isSampleOrderAllowed: true,
        variantOptions: [
          createVariantOption({
            isSampleOrderAllowed: true
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is true and base is true and ENABLE_SAMPLE_ORDERING is not set", async () => {
    delete process.env.ENABLE_SAMPLE_ORDERING;
    const products = [
      createProduct({
        isSampleOrderAllowed: true,
        variantOptions: [
          createVariantOption({
            isSampleOrderAllowed: true
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("use variant product benefits if available", async () => {
    const products = [
      createProduct({
        productBenefits: ["base-product-benefit"],
        variantOptions: [
          createVariantOption({
            productBenefits: ["variant-product-benefit"]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].productBenefits).toEqual(
      products[0].variantOptions![0].productBenefits
    );
  });

  it("use variant product benefits if empty array", async () => {
    const products = [
      createProduct({
        productBenefits: ["base-product-benefit"],
        variantOptions: [
          createVariantOption({
            productBenefits: []
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].productBenefits).toEqual(
      products[0].variantOptions![0].productBenefits
    );
  });

  it("use base product benefits if variant product variants isn't available", async () => {
    const products = [
      createProduct({
        productBenefits: ["base-product-benefit"],
        variantOptions: [
          createVariantOption({
            productBenefits: undefined
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].productBenefits).toEqual(
      products[0].productBenefits
    );
  });

  it("handles classification without features", async () => {
    const classification = createClassification({ features: undefined });
    const products = [
      createProduct({
        classifications: [classification],
        variantOptions: [
          createVariantOption({
            classifications: [classification]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].classifications).toEqual([]);
  });

  it("filters out unwanted classification features from base product", async () => {
    const products = [
      createProduct({
        classifications: createIgnorableClassifications,
        variantOptions: [
          createVariantOption({
            classifications: []
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].classifications).toMatchInlineSnapshot(
      [
        {
          name: "cartonUomAttributes",
          features: [
            {
              name: "name",
              value: "cartonUomAttributes.categoryOfEan11 symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.denominatorForConversion symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.ean11 symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.grossWeight symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.height symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.length symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.numeratorForConversion symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.volume symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.width symbol"
            }
          ]
        },

        {
          name: "drumUomAttributes",
          features: [
            {
              name: "name",
              value: "drumUomAttributes.categoryOfEan11 symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.denominatorForConversion symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.ean11 symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.grossWeight symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.height symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.length symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.numeratorForConversion symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.volume symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.width symbol"
            }
          ]
        }
      ],
      `
      Array [
        Object {
          "features": Array [
            Object {
              "name": "name",
              "value": "cartonUomAttributes.categoryOfEan11 symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.denominatorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.ean11 symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.grossWeight symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.height symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.length symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.numeratorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.volume symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.width symbol",
            },
          ],
          "name": "cartonUomAttributes",
        },
        Object {
          "features": Array [
            Object {
              "name": "name",
              "value": "drumUomAttributes.categoryOfEan11 symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.denominatorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.ean11 symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.grossWeight symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.height symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.length symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.numeratorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.volume symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.width symbol",
            },
          ],
          "name": "drumUomAttributes",
        },
      ]
    `
    );
  });

  it("filters out unwanted classification features from variant", async () => {
    const products = [
      createProduct({
        classifications: [],
        variantOptions: [
          createVariantOption({
            classifications: createIgnorableClassifications
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].classifications).toMatchInlineSnapshot(
      [
        {
          name: "cartonUomAttributes",
          features: [
            {
              name: "name",
              value: "cartonUomAttributes.categoryOfEan11 symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.denominatorForConversion symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.ean11 symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.grossWeight symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.height symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.length symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.numeratorForConversion symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.volume symbol"
            },

            {
              name: "name",
              value: "cartonUomAttributes.width symbol"
            }
          ]
        },

        {
          name: "drumUomAttributes",
          features: [
            {
              name: "name",
              value: "drumUomAttributes.categoryOfEan11 symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.denominatorForConversion symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.ean11 symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.grossWeight symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.height symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.length symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.numeratorForConversion symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.volume symbol"
            },

            {
              name: "name",
              value: "drumUomAttributes.width symbol"
            }
          ]
        }
      ],
      `
      Array [
        Object {
          "features": Array [
            Object {
              "name": "name",
              "value": "cartonUomAttributes.categoryOfEan11 symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.denominatorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.ean11 symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.grossWeight symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.height symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.length symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.numeratorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.volume symbol",
            },
            Object {
              "name": "name",
              "value": "cartonUomAttributes.width symbol",
            },
          ],
          "name": "cartonUomAttributes",
        },
        Object {
          "features": Array [
            Object {
              "name": "name",
              "value": "drumUomAttributes.categoryOfEan11 symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.denominatorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.ean11 symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.grossWeight symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.height symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.length symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.numeratorForConversion symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.volume symbol",
            },
            Object {
              "name": "name",
              "value": "drumUomAttributes.width symbol",
            },
          ],
          "name": "drumUomAttributes",
        },
      ]
    `
    );
  });

  it("handles video asset without URL", async () => {
    const asset = createAsset({ assetType: "VIDEO", url: undefined });
    const products = [
      createProduct({
        assets: [asset]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].videos).toEqual([
      {
        label: asset.name,
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        youtubeId: ""
      }
    ]);
  });

  it("handles brand category without an image", async () => {
    const brand = createCategory({ categoryType: "Brand", image: undefined });
    const products = [
      createProduct({
        categories: [brand]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].brand).toEqual({
      code: brand.code,
      name: brand.name,
      logo: undefined
    });
  });

  it("handles variants without images", async () => {
    const products = [
      createProduct({
        variantOptions: [
          createVariantOption({ code: "variant1", images: undefined }),
          createVariantOption({ code: "variant2", images: undefined })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      undefined
    );
    expect(transformedProducts[1].relatedVariants[0].thumbnail).toEqual(
      undefined
    );
  });

  it("handles missing master images", async () => {
    const products = [
      createProduct({
        images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
          }),
          createVariantOption({
            code: "variant2",
            images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].masterImages).toEqual([]);
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      undefined
    );
  });

  it("handles master images with missing image without format", async () => {
    const products = [
      createProduct({
        images: [
          createImage({
            assetType: "MASTER_IMAGE",
            format: "Product-Hero-Small-Desktop-Tablet"
          }),
          createImage({
            assetType: "MASTER_IMAGE",
            format: "Product-Color-Selector-Mobile"
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            images: [
              createImage({
                assetType: "MASTER_IMAGE",
                format: "Product-Hero-Small-Desktop-Tablet"
              }),
              createImage({
                assetType: "MASTER_IMAGE",
                format: "Product-Color-Selector-Mobile"
              })
            ]
          }),
          createVariantOption({
            code: "variant2",
            images: [
              createImage({
                assetType: "MASTER_IMAGE",
                format: "Product-Hero-Small-Desktop-Tablet"
              }),
              createImage({
                assetType: "MASTER_IMAGE",
                format: "Product-Color-Selector-Mobile"
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].masterImages).toEqual([
      {
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000",
        altText: undefined
      }
    ]);
  });

  it("handles missing gallery images", async () => {
    const products = [
      createProduct({
        images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
          }),
          createVariantOption({
            code: "variant2",
            images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].galleryImages).toEqual([]);
  });

  it("handles gallery images with missing image without format", async () => {
    const products = [
      createProduct({
        images: [
          createImage({
            assetType: "GALLERY",
            format: "Product-Hero-Small-Desktop-Tablet"
          }),
          createImage({
            assetType: "GALLERY",
            format: "Product-Color-Selector-Mobile"
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            images: [
              createImage({
                assetType: "GALLERY",
                format: "Product-Hero-Small-Desktop-Tablet"
              }),
              createImage({
                assetType: "GALLERY",
                format: "Product-Color-Selector-Mobile"
              })
            ]
          }),
          createVariantOption({
            code: "variant2",
            images: [
              createImage({
                assetType: "GALLERY",
                format: "Product-Hero-Small-Desktop-Tablet"
              }),
              createImage({
                assetType: "GALLERY",
                format: "Product-Color-Selector-Mobile"
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].galleryImages).toEqual([
      {
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000",
        altText: undefined
      }
    ]);
  });

  it("handles measurements with different unit symbols", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: createFeatureUnit({ symbol: "mm" })
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: createFeatureUnit({ symbol: "cm" })
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: createFeatureUnit({ symbol: "mm" })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: createFeatureUnit({ symbol: "cm" })
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].measurements.label).toEqual("3mm x 4cm");
  });

  it("handles measurements with missing featureUnit", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: undefined
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: undefined
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "5" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "6" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "7" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "8" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "9" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "10" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "11" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "12" })],
                    featureUnit: undefined
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].measurements.label).toEqual("3x4x5");
    expect(transformedProducts[0].measurements.length!.unit).toEqual("");
    expect(transformedProducts[0].measurements.width!.unit).toEqual("");
    expect(transformedProducts[0].measurements.height!.unit).toEqual("");
    expect(transformedProducts[0].measurements.thickness!.unit).toEqual("");
    expect(transformedProducts[0].measurements.volume!.unit).toEqual("");
    expect(transformedProducts[0].weight.grossWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.netWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPallet!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPiece!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerSqm!.unit).toEqual("");
  });

  it("handles measurements with missing unit symbols", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: createFeatureUnit({ symbol: undefined })
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: createFeatureUnit({ symbol: undefined })
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "5" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "6" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "7" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "8" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "9" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "10" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "11" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "11" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].measurements.label).toEqual("3x4x5");
    expect(transformedProducts[0].measurements.length!.unit).toEqual("");
    expect(transformedProducts[0].measurements.width!.unit).toEqual("");
    expect(transformedProducts[0].measurements.height!.unit).toEqual("");
    expect(transformedProducts[0].measurements.thickness!.unit).toEqual("");
    expect(transformedProducts[0].measurements.volume!.unit).toEqual("");
    expect(transformedProducts[0].weight.grossWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.netWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPallet!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPiece!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerSqm!.unit).toEqual("");
  });

  it("handles measurements on related variants with different unit symbols", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: createFeatureUnit({ symbol: "mm" })
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: createFeatureUnit({ symbol: "cm" })
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: createFeatureUnit({ symbol: "mm" })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: createFeatureUnit({ symbol: "cm" })
                  })
                ]
              })
            ]
          }),
          createVariantOption({
            code: "variant2",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "5" })],
                    featureUnit: createFeatureUnit({ symbol: "mm" })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "6" })],
                    featureUnit: createFeatureUnit({ symbol: "cm" })
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("5mm x 6cm");
  });

  it("handles measurements on related variants with missing featureUnit", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: undefined
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: undefined
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "5" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "6" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "7" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "8" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "9" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "10" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "11" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "12" })],
                    featureUnit: undefined
                  })
                ]
              })
            ]
          }),
          createVariantOption({
            code: "variant2",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "13" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "14" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "15" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "16" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "17" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "18" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "19" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "20" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "21" })],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "22" })],
                    featureUnit: undefined
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("13x14x15");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.length!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.width!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.height!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.thickness!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.volume!.unit
    ).toEqual("");
  });

  it("handles measurements on related varaints with missing unit symbols", async () => {
    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "measurements",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.length",
                featureValues: [createFeatureValue({ value: "1" })],
                featureUnit: createFeatureUnit({ symbol: undefined })
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/measurements.width",
                featureValues: [createFeatureValue({ value: "2" })],
                featureUnit: createFeatureUnit({ symbol: undefined })
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            code: "variant1",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "3" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "4" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "5" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "6" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "7" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "8" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "9" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "10" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "11" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "12" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  })
                ]
              })
            ]
          }),
          createVariantOption({
            code: "variant2",
            classifications: [
              createClassification({
                code: "measurements",
                features: [
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.length",
                    featureValues: [createFeatureValue({ value: "13" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.width",
                    featureValues: [createFeatureValue({ value: "14" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.height",
                    featureValues: [createFeatureValue({ value: "15" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.thickness",
                    featureValues: [createFeatureValue({ value: "16" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/measurements.volume",
                    featureValues: [createFeatureValue({ value: "17" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                    featureValues: [createFeatureValue({ value: "18" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                    featureValues: [createFeatureValue({ value: "19" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                    featureValues: [createFeatureValue({ value: "20" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                    featureValues: [createFeatureValue({ value: "21" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  }),
                  createFeature({
                    code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                    featureValues: [createFeatureValue({ value: "22" })],
                    featureUnit: createFeatureUnit({ symbol: undefined })
                  })
                ]
              })
            ]
          })
        ]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("13x14x15");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.length!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.width!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.height!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.thickness!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.volume!.unit
    ).toEqual("");
  });

  it("creates path from variant attribute if variant attrubite present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                featureValues: [{ value: "Gloss" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }]
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-diameter-40mm-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if variant attrubite not present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }]
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is false", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }]
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }]
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }]
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just colour if texture family and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just texture family if colour and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-gloss-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just materials if colour and texture family not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const products = [
      createProduct({
        classifications: [
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }]
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [createVariantOption({ code: "variant-code" })]
      })
    ];
    const transformedProducts = await transformProducts(products);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-clay-3464354221`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });
});
