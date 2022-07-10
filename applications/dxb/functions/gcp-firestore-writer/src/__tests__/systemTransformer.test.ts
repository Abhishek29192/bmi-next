import {
  createAsset,
  createClassification,
  createFeature,
  createFullyPopulatedSystem,
  createImage,
  createSystem,
  createSystemLayer,
  createSystemReference,
  System
} from "@bmi/pim-types";
import { transformSystems } from "../systemTransformer";

jest.mock("@bmi-digital/functions-logger");

describe("transformSystems", () => {
  it("transforms a system with minimal data", () => {
    const system: System = {
      type: undefined,
      approvalStatus: "approved",
      assets: undefined,
      categories: [],
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
    const transformedSystems = transformSystems([system]);
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
        images: [],
        keyFeatures: undefined,
        layerCodes: [],
        name: "name",
        path: "/s/code-name-1853176582",
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
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems).toMatchInlineSnapshot(`
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
          "bim": Object {
            "name": "name",
            "url": "http://localhost:8000",
          },
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
          ],
          "classifications": Array [
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
          "code": "code",
          "description": "<p>Some very long description</p>",
          "documents": Array [
            Object {
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
            Object {
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
            Object {
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
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "1853176582",
          "images": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "keyFeatures": Object {
            "name": "System Attributes",
            "values": Array [
              "KF1",
              "KF2",
            ],
          },
          "layerCodes": Array [
            "Layer_19",
          ],
          "name": "name",
          "path": "/s/code-name-1853176582",
          "promotionalContent": "Promotional content value",
          "scoringWeight": 100,
          "shortDescription": "Short description",
          "specification": Object {
            "allowedToDownload": true,
            "assetType": "SPECIFICATION",
            "fileSize": 10,
            "format": "pdf",
            "mime": "application/pdf",
            "name": "name",
            "realFileName": "real-file-name.pdf",
            "url": "http://localhost:8000",
          },
          "systemBenefits": Array [],
          "systemLayers": Array [
            Object {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": Array [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": Array [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
          ],
          "systemReferences": Array [
            "Test_PIM_System2",
          ],
          "uniqueSellingPropositions": Array [
            "USP 1",
            "USP 2",
          ],
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
        },
      ]
    `);
  });

  it("transforms a fully populated system with multiple layers", () => {
    const system = createFullyPopulatedSystem([
      createSystemLayer({ code: "layer 1" }),
      createSystemLayer({ code: "layer 2" })
    ]);
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems).toMatchInlineSnapshot(`
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
          "bim": Object {
            "name": "name",
            "url": "http://localhost:8000",
          },
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
          ],
          "classifications": Array [
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
          "code": "code",
          "description": "<p>Some very long description</p>",
          "documents": Array [
            Object {
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
            Object {
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
            Object {
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
          "guaranteesAndWarrantiesImages": Array [],
          "guaranteesAndWarrantiesLinks": Array [],
          "hashedCode": "1853176582",
          "images": Array [
            Object {
              "altText": "name",
              "mainSource": "http://localhost:8000",
              "thumbnail": "http://localhost:8000",
            },
          ],
          "keyFeatures": Object {
            "name": "System Attributes",
            "values": Array [
              "KF1",
              "KF2",
            ],
          },
          "layerCodes": Array [
            "layer 1",
            "layer 2",
          ],
          "name": "name",
          "path": "/s/code-name-1853176582",
          "promotionalContent": "Promotional content value",
          "scoringWeight": 100,
          "shortDescription": "Short description",
          "specification": Object {
            "allowedToDownload": true,
            "assetType": "SPECIFICATION",
            "fileSize": 10,
            "format": "pdf",
            "mime": "application/pdf",
            "name": "name",
            "realFileName": "real-file-name.pdf",
            "url": "http://localhost:8000",
          },
          "systemBenefits": Array [],
          "systemLayers": Array [
            Object {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": Array [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": Array [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
            Object {
              "layerNumber": "layerNo 1",
              "name": "layer name",
              "relatedOptionalProducts": Array [
                "400120_Monarplan_Outside_corner_anthracite",
              ],
              "relatedProducts": Array [
                "300190_Rubber_sheat",
              ],
              "shortDescription": "SDescription 1 NO",
              "type": "LAYER_ACCESSORIES",
            },
          ],
          "systemReferences": Array [
            "Test_PIM_System2",
          ],
          "uniqueSellingPropositions": Array [
            "USP 1",
            "USP 2",
          ],
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
        },
      ]
    `);
  });

  it("transforms multiple fully populated system", () => {
    const system1 = createSystem({ code: "system 1" });
    const system2 = createSystem({ code: "system 2" });
    const transformedSystems = transformSystems([system1, system2]);
    expect(transformedSystems).toHaveLength(2);
  });

  it("ignores systems that are not approved", () => {
    const system1 = createSystem({ code: "system 1", approvalStatus: "check" });
    const system2 = createSystem({
      code: "system 2",
      approvalStatus: "unapproved"
    });
    const system3 = createSystem({
      code: "system 3",
      approvalStatus: "approved"
    });
    const transformedSystems = transformSystems([system1, system2, system3]);
    expect(transformedSystems).toHaveLength(1);
    expect(transformedSystems[0].code).toEqual("system 3");
  });

  it("ignores system layers that are not approved", () => {
    const system = createFullyPopulatedSystem([
      createSystemLayer({
        code: "layer 1",
        name: "layer 1",
        approvalStatus: "check"
      }),
      createSystemLayer({
        code: "layer 2",
        name: "layer 2",
        approvalStatus: "unapproved"
      }),
      createSystemLayer({
        code: "layer 3",
        name: "layer 3",
        approvalStatus: "approved"
      }),
      createSystemLayer({
        code: "layer 4",
        name: "layer 4",
        approvalStatus: "approved",
        shortDescription: "short-description"
      })
    ]);
    const transformedSystems = transformSystems([system]);
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
        createImage({
          assetType: "GALLERY",
          format: "Product-Color-Selector-Mobile"
        }),
        createImage({ assetType: "GALLERY", format: undefined })
      ]
    });
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].images).toEqual([]);
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
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].keyFeatures).toEqual({
      name: "name",
      values: []
    });
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
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].keyFeatures).toEqual({
      name: "name",
      values: []
    });
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
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].keyFeatures).toEqual({
      name: "name",
      values: []
    });
  });

  it("handles a system layer without products", () => {
    const system = createSystem({
      systemLayers: [
        createSystemLayer({
          products: undefined
        })
      ]
    });
    const transformedSystems = transformSystems([system]);
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
    const transformedSystems = transformSystems([system]);
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
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].systemReferences).toEqual([]);
  });

  it("handles video asset without URL", () => {
    const asset = createAsset({ assetType: "VIDEO", url: undefined });
    const systems = [
      createSystem({
        assets: [asset]
      })
    ];
    const transformedSystem = transformSystems(systems);
    expect(transformedSystem[0].videos).toEqual([
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

  it("handles no images", () => {
    const system = createSystem({
      images: undefined
    });
    const transformedSystems = transformSystems([system]);
    expect(transformedSystems[0].images).toEqual([]);
  });
});
