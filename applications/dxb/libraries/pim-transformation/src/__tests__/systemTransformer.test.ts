import {
  ApprovalStatus,
  createAsset,
  createCategory,
  createClassification,
  createFeature,
  createFeatureValue,
  createFullyPopulatedSystem,
  createImage,
  createSystem,
  createSystemLayer,
  createSystemReference,
  GoodBetterBest,
  System
} from "@bmi/pim-types";
import { jest } from "@jest/globals";
import { transformSystem } from "../systemTransformer.js";

jest.mock("@bmi-digital/functions-logger");

describe("transformSystem", () => {
  it("transforms a system with minimal data", () => {
    const system: System = {
      type: undefined,
      approvalStatus: ApprovalStatus.Approved,
      assets: undefined,
      categories: undefined,
      classifications: undefined,
      code: "code",
      images: [],
      longDescription: "long description",
      name: "name",
      shortDescription: "short description",
      systemBenefits: undefined,
      systemLayers: undefined,
      systemReferences: undefined
    };
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toEqual([
      {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        bim: undefined,
        brand: undefined,
        categories: [],
        classifications: [],
        code: "code",
        description: "long description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        hashedCode: "1853176582",
        galleryImages: [],
        masterImage: undefined,
        keyFeatures: undefined,
        layerCodes: [],
        name: "name",
        path: "/s/name-1853176582",
        promotionalContent: undefined,
        scoringWeight: 0,
        shortDescription: "short description",
        specification: undefined,
        systemBenefits: undefined,
        systemLayers: [],
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: []
      }
    ]);
  });

  it("transforms a fully populated system", () => {
    const system = createFullyPopulatedSystem();
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toMatchInlineSnapshot(`
      [
        {
          "awardsAndCertificateDocuments": [
            {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
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
          "awardsAndCertificateImages": [
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            {
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
          "bim": {
            "name": "name",
            "url": "http://localhost:8000",
          },
          "brand": {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": [
            {
              "categoryType": "Brand",
              "code": "code",
              "image": {
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
          ],
          "classifications": [
            {
              "features": [
                {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "code",
          "description": "<p>Some very long description</p>",
          "documents": [
            {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
          "galleryImages": [
            {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "goodBetterBest": undefined,
          "guaranteesAndWarrantiesImages": [],
          "guaranteesAndWarrantiesLinks": [],
          "hashedCode": "1853176582",
          "keyFeatures": {
            "name": "System Attributes",
            "values": [
              "KF1",
              "KF2",
            ],
          },
          "layerCodes": [
            "Layer_19",
          ],
          "masterImage": {
            "altText": "name",
            "mainSource": "http://localhost:8000",
            "thumbnail": "http://localhost:8000",
          },
          "name": "name",
          "path": "/s/name-1853176582",
          "promotionalContent": "Promotional content value",
          "scoringWeight": 100,
          "shortDescription": "Short description",
          "specification": {
            "allowedToDownload": true,
            "assetType": "SPECIFICATION",
            "fileSize": 10,
            "format": "pdf",
            "mime": "application/pdf",
            "name": "name",
            "realFileName": "real-file-name.pdf",
            "url": "http://localhost:8000",
          },
          "systemBenefits": [],
          "systemLayers": [
            {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
          ],
          "systemReferences": [
            "Test_PIM_System2",
          ],
          "uniqueSellingPropositions": [
            "USP 1",
            "USP 2",
          ],
          "videos": [
            {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "videoUrl": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
        },
      ]
    `);
  });

  it("transforms a fully populated system with multiple layers", () => {
    const system = createFullyPopulatedSystem({
      systemLayers: [
        createSystemLayer({ code: "layer 1" }),
        createSystemLayer({ code: "layer 2" })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toMatchInlineSnapshot(`
      [
        {
          "awardsAndCertificateDocuments": [
            {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
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
          "awardsAndCertificateImages": [
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            {
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
          "bim": {
            "name": "name",
            "url": "http://localhost:8000",
          },
          "brand": {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": [
            {
              "categoryType": "Brand",
              "code": "code",
              "image": {
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
          ],
          "classifications": [
            {
              "features": [
                {
                  "name": "name",
                  "value": "value symbol",
                },
              ],
              "name": "name",
            },
          ],
          "code": "code",
          "description": "<p>Some very long description</p>",
          "documents": [
            {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
          "galleryImages": [
            {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "goodBetterBest": undefined,
          "guaranteesAndWarrantiesImages": [],
          "guaranteesAndWarrantiesLinks": [],
          "hashedCode": "1853176582",
          "keyFeatures": {
            "name": "System Attributes",
            "values": [
              "KF1",
              "KF2",
            ],
          },
          "layerCodes": [
            "layer 1",
            "layer 2",
          ],
          "masterImage": {
            "altText": "name",
            "mainSource": "http://localhost:8000",
            "thumbnail": "http://localhost:8000",
          },
          "name": "name",
          "path": "/s/name-1853176582",
          "promotionalContent": "Promotional content value",
          "scoringWeight": 100,
          "shortDescription": "Short description",
          "specification": {
            "allowedToDownload": true,
            "assetType": "SPECIFICATION",
            "fileSize": 10,
            "format": "pdf",
            "mime": "application/pdf",
            "name": "name",
            "realFileName": "real-file-name.pdf",
            "url": "http://localhost:8000",
          },
          "systemBenefits": [],
          "systemLayers": [
            {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
            {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
          ],
          "systemReferences": [
            "Test_PIM_System2",
          ],
          "uniqueSellingPropositions": [
            "USP 1",
            "USP 2",
          ],
          "videos": [
            {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "videoUrl": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
        },
      ]
    `);
  });

  it("ignores systems that have approval status check", () => {
    const system = createSystem({ approvalStatus: ApprovalStatus.Check });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toStrictEqual([]);
  });

  it("ignores systems that have approval status unapproved", () => {
    const system = createSystem({ approvalStatus: ApprovalStatus.Unapproved });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toStrictEqual([]);
  });

  it("ignores systems that have approval status preview", () => {
    const system = createSystem({
      approvalStatus: ApprovalStatus.Preview
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toStrictEqual([]);
  });

  it("ignores system layers that are not approved", () => {
    const system = createFullyPopulatedSystem({
      systemLayers: [
        createSystemLayer({
          code: "layer 1",
          name: "layer 1",
          approvalStatus: ApprovalStatus.Check
        }),
        createSystemLayer({
          code: "layer 2",
          name: "layer 2",
          approvalStatus: ApprovalStatus.Unapproved
        }),
        createSystemLayer({
          code: "layer 3",
          name: "layer 3",
          approvalStatus: ApprovalStatus.Approved
        }),
        createSystemLayer({
          code: "layer 4",
          name: "layer 4",
          approvalStatus: ApprovalStatus.Approved,
          shortDescription: "short-description"
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].systemLayers).toHaveLength(2);
    expect(transformedSystems[0].systemLayers![0].name).toEqual("layer 3");
    expect(transformedSystems[0].systemLayers![0].shortDescription).toEqual(
      "SDescription 1 NO"
    );
    expect(transformedSystems[0].systemLayers![1].name).toEqual("layer 4");
    expect(transformedSystems[0].systemLayers![1].shortDescription).toEqual(
      "short-description"
    );
  });

  it("handles no master images", () => {
    const system = createSystem({
      images: [
        createImage({
          assetType: "GALLERY",
          format: "Product-Hero-Small-Desktop-Tablet"
        }),
        createImage({ assetType: "GALLERY", format: undefined })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].galleryImages.length).toEqual(1);
    expect(transformedSystems[0].masterImage).toBeUndefined();
  });

  it("ignores Channel categories", () => {
    const brandCategory = createCategory({
      categoryType: "Brand"
    });
    const system = createSystem({
      categories: [
        brandCategory,
        createCategory({
          categoryType: "Channel"
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].categories).toEqual([brandCategory]);
  });

  it("ignores key features classification without features", () => {
    const system = createSystem({
      classifications: [
        createClassification({
          code: "systemAttributes",
          features: undefined
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].keyFeatures).toBeUndefined();
  });

  it("ignores key features classification with empty features", () => {
    const system = createSystem({
      classifications: [
        createClassification({
          code: "systemAttributes",
          features: []
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].keyFeatures).toBeUndefined();
  });

  it("ignores key features classification without features when system attributes has features", () => {
    const system = createSystem({
      classifications: [
        createClassification({
          code: "systemAttributes",
          features: [createFeature()]
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].keyFeatures).toBeUndefined();
  });

  it("handles a system layer without products", () => {
    const system = createSystem({
      systemLayers: [
        createSystemLayer({
          products: undefined
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].systemLayers![0].relatedProducts).toEqual([]);
  });

  it("handles a system layer without optional products", () => {
    const system = createSystem({
      systemLayers: [
        createSystemLayer({
          optionalProducts: undefined
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(
      transformedSystems[0].systemLayers![0].relatedOptionalProducts
    ).toEqual([]);
  });

  it("ignores system references that aren't CROSSEllING", () => {
    const system = createSystem({
      systemReferences: [
        createSystemReference({ referenceType: "UPSELLING" as const })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].systemReferences).toEqual([]);
  });

  it("handles video asset without URL", () => {
    const asset = createAsset({ assetType: "VIDEO", url: undefined });
    const system = createSystem({
      assets: [asset]
    });
    const transformedSystem = transformSystem(system);
    expect(transformedSystem[0].videos).toEqual([
      {
        label: asset.name,
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        videoUrl: ""
      }
    ]);
  });

  it("handles video asset of just YouTube ID", () => {
    const asset = createAsset({ assetType: "VIDEO", url: "3901c0ds7oo" });
    const system = createSystem({
      assets: [asset]
    });
    const transformedSystem = transformSystem(system);
    expect(transformedSystem[0].videos).toEqual([
      {
        label: asset.name,
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        videoUrl: "https://www.youtube.com/watch?v=3901c0ds7oo"
      }
    ]);
  });

  it("handles no images", () => {
    const system = createSystem({
      images: undefined
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].galleryImages).toEqual([]);
    expect(transformedSystems[0].masterImage).toBeUndefined();
  });

  it("returns data without keyFeatures if there is no systemAttributes.keyfeatures", () => {
    const system = createSystem({
      classifications: [
        createClassification({
          code: "systemAttributes",
          features: [
            createFeature({
              code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.PromotionalContent",
              name: "PromotionalContent",
              featureValues: [{ value: "fake value" }]
            })
          ]
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems[0].keyFeatures).toBeUndefined();
  });

  it("returns correct data if systemAttributes.keyfeatures exists", () => {
    const system = createSystem({
      classifications: [
        createClassification({
          code: "systemAttributes",
          features: [
            createFeature({
              code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyFeatures",
              name: "PromotionalContent",
              featureValues: [
                { value: "value-1" },
                { value: "value-2" },
                { value: "value-3" }
              ]
            })
          ]
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    const expectedResult = ["value-1", "value-2", "value-3"];
    expect(transformedSystems[0].keyFeatures?.values).toStrictEqual(
      expectedResult
    );
  });

  // TODO: Remove test case - DXB-3449
  it("is case-insensitive for system classification codes", () => {
    const system = createFullyPopulatedSystem({
      classifications: [
        createClassification({
          code: "ScoringWeightAttributes",
          name: "Scoring",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/ScoringWeightAttributes.ScoringWeight",
              name: "Scoring Weight",
              featureValues: [
                createFeatureValue({ code: undefined, value: "100" })
              ]
            })
          ]
        }),
        createClassification({
          code: "SystemAttributes",
          name: "System Attributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/SystemAttributes.UniqueSellingPropositions",
              name: "Unique Selling Propositions",
              featureValues: [
                createFeatureValue({ code: undefined, value: "USP 1" }),
                createFeatureValue({ code: undefined, value: "USP 2" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/SystemAttributes.PromotionalContent",
              name: "Promotional Content",
              featureValues: [
                createFeatureValue({
                  code: undefined,
                  value: "Promotional content value"
                })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/SystemAttributes.KeyFeatures",
              name: "Key Features",
              featureValues: [
                createFeatureValue({ code: undefined, value: "KF1" }),
                createFeatureValue({ code: undefined, value: "KF2" })
              ]
            })
          ]
        })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toMatchInlineSnapshot(`
      [
        {
          "awardsAndCertificateDocuments": [
            {
              "allowedToDownload": true,
              "assetType": "AWARDS",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": false,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": undefined,
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 1.7976931348623157e+308,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": undefined,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": "real-file-name.pdf",
              "url": "http://localhost:8000",
            },
            {
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
          "awardsAndCertificateImages": [
            {
              "allowedToDownload": true,
              "assetType": "CERTIFICATES",
              "fileSize": 10,
              "format": "pdf",
              "mime": "application/pdf",
              "name": "name",
              "realFileName": undefined,
              "url": "http://localhost:8000",
            },
            {
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
          "bim": {
            "name": "name",
            "url": "http://localhost:8000",
          },
          "brand": {
            "code": "code",
            "logo": "http://localhost:8000",
            "name": "name",
          },
          "categories": [
            {
              "categoryType": "Brand",
              "code": "code",
              "image": {
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
          ],
          "classifications": [],
          "code": "code",
          "description": "<p>Some very long description</p>",
          "documents": [
            {
              "assetType": "ASSEMBLY_INSTRUCTIONS",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "SPECIFICATION",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "2583923841",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "http://localhost:8000",
            },
            {
              "assetType": "VIDEO",
              "extension": "pdf",
              "fileSize": 10,
              "format": "application/pdf",
              "id": "84587715",
              "isLinkDocument": false,
              "realFileName": "real-file-name.pdf",
              "title": "name",
              "url": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
          "galleryImages": [
            {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "goodBetterBest": undefined,
          "guaranteesAndWarrantiesImages": [],
          "guaranteesAndWarrantiesLinks": [],
          "hashedCode": "1853176582",
          "keyFeatures": {
            "name": "System Attributes",
            "values": [
              "KF1",
              "KF2",
            ],
          },
          "layerCodes": [
            "Layer_19",
          ],
          "masterImage": {
            "altText": "name",
            "mainSource": "http://localhost:8000",
            "thumbnail": "http://localhost:8000",
          },
          "name": "name",
          "path": "/s/name-1853176582",
          "promotionalContent": "Promotional content value",
          "scoringWeight": 100,
          "shortDescription": "Short description",
          "specification": {
            "allowedToDownload": true,
            "assetType": "SPECIFICATION",
            "fileSize": 10,
            "format": "pdf",
            "mime": "application/pdf",
            "name": "name",
            "realFileName": "real-file-name.pdf",
            "url": "http://localhost:8000",
          },
          "systemBenefits": [],
          "systemLayers": [
            {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
          ],
          "systemReferences": [
            "Test_PIM_System2",
          ],
          "uniqueSellingPropositions": [
            "USP 1",
            "USP 2",
          ],
          "videos": [
            {
              "label": "name",
              "previewMedia": null,
              "subtitle": null,
              "title": "",
              "videoRatio": null,
              "videoUrl": "https://www.youtube.com/watch?v=3901c0ds7oo",
            },
          ],
        },
      ]
    `);
  });

  it("returns transformed system with goodBetterBest field", () => {
    const system = createSystem({ goodBetterBest: GoodBetterBest.best });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          goodBetterBest: GoodBetterBest.best
        })
      ])
    );
  });
});
