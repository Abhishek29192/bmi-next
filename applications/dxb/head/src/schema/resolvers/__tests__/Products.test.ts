import createAsset from "../../../__tests__/AssetHelper";
import createCategory from "../../../__tests__/CategoryHelper";
import createClassification, {
  createFeature
} from "../../../__tests__/ClassificationHelper";
import { createVariantOption } from "../../../__tests__/PimDocumentProductHelper";
import Products from "../Products";
import { Context, Node } from "../types";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn().mockImplementation(({ query }) => {
      const { categoryCodes } = query && query.filter;

      if (!categoryCodes.in.length) {
        return { entries: [] };
      }
      return { entries: [{ type: "parentFamily" }] };
    })
  }
};

jest.mock("../utils/path", () => {
  const originalModule = jest.requireActual("../utils/path");
  return {
    ...originalModule,
    resolvePath: jest
      .fn()
      .mockResolvedValue([{ id: "path", label: "label", slug: "slug" }])
  };
});
jest.mock("../../../utils/encryption", () => {
  const originalModule = jest.requireActual("../../../utils/encryption");

  return {
    ...originalModule,
    generateIdFromString: (name: string) => name
  };
});
jest.mock("../../../utils/product-url-path", () => ({
  generateSimpleProductUrl: jest.fn().mockReturnValue("simple-path")
}));

const EXPECTED_VARIANT_OPTIONS = [
  {
    approvalStatus: "approved",
    breadcrumbs: [
      {
        id: "path",
        label: "label",
        slug: "slug"
      },
      {
        id: "variant-2",
        label: "source-name",
        slug: "source-name/variant-2"
      }
    ],
    classifications: null,
    code: "variant-2",
    externalProductCode: "variant-product-code",
    id: "variant-2",
    images: null,
    isSampleOrderAllowed: true,
    longDescription: "variant-long-desc",
    oldPath: "p/slug/source-name/variant-2/",
    path: "p/slug/source-name/variant-2/",
    shortDescription: "variant-short-desc"
  },
  {
    approvalStatus: "approved",
    breadcrumbs: [
      {
        id: "path",
        label: "label",
        slug: "slug"
      },
      {
        id: "variant-3",
        label: "source-name",
        slug: "source-name/colour-value/variant-3"
      }
    ],
    classifications: [
      {
        code: "appearanceAttributes",
        features: [
          {
            code: "colour",
            featureUnit: {
              name: "classification-feature-feature-unit-name",
              symbol: "classification-feature-feature-unit-symbol",
              unitType: "classification-feature-feature-unit-unit-type"
            },
            featureValues: [
              {
                value: "Colour Value"
              }
            ],
            name: "classification-feature-name"
          },
          {
            code: "measurements",
            featureUnit: {
              name: "classification-feature-feature-unit-name",
              symbol: "classification-feature-feature-unit-symbol",
              unitType: "classification-feature-feature-unit-unit-type"
            },
            featureValues: [
              {
                value: "Some Value"
              }
            ],
            name: "classification-feature-name"
          }
        ],
        name: "appearanceAttributes"
      }
    ],
    code: "variant-3",
    externalProductCode: "variant-product-code",
    id: "variant-3",
    images: null,
    isSampleOrderAllowed: true,
    longDescription: "variant-long-desc",
    oldPath: "p/slug/source-name/colour-value/variant-3/",
    path: "p/slug/source-name/colour-value/variant-3/",
    shortDescription: "variant-short-desc"
  }
];

describe("Products resolver", () => {
  describe("variantOption resolver", () => {
    const source: Node = {
      id: "source",
      name: "source-name",
      children: null,
      internal: null,
      parent: null,
      variantOptions: [
        createVariantOption({
          code: "variant-1",
          approvalStatus: "unapproved"
        }),
        createVariantOption({
          code: "variant-2",
          approvalStatus: "approved",
          classifications: null
        }),
        createVariantOption({
          code: "variant-3",
          approvalStatus: "approved",
          classifications: [
            createClassification({
              features: [
                createFeature({
                  code: "colour",
                  featureValues: [{ value: "Colour Value" }]
                }),
                createFeature({
                  code: "measurements",
                  featureValues: [{ value: "Some Value" }]
                })
              ]
            })
          ]
        })
      ],
      categories: [createCategory()]
    };
    it("should resolve empty array if no variantOptions provided", async () => {
      expect(
        await Products.variantOptions.resolve(
          { ...source, variantOptions: null },
          null,
          context
        )
      ).toEqual([]);
    });

    it("should resolve variantOptions", async () => {
      expect(
        await Products.variantOptions.resolve(source, null, context)
      ).toEqual(EXPECTED_VARIANT_OPTIONS);
    });

    it("should validate parentFamilies", async () => {
      expect(
        await Products.variantOptions.resolve(
          {
            ...source,
            categories: null,
            variantOptions: [
              createVariantOption({
                code: "variant-2",
                approvalStatus: "approved",
                classifications: null
              })
            ]
          },
          null,
          context
        )
      ).toEqual([
        {
          approvalStatus: "approved",
          breadcrumbs: [
            {
              id: "variant-2",
              label: "source-name",
              slug: "source-name/variant-2"
            }
          ],
          classifications: null,
          code: "variant-2",
          externalProductCode: "variant-product-code",
          id: "variant-2",
          images: null,
          isSampleOrderAllowed: true,
          longDescription: "variant-long-desc",
          oldPath: "p/source-name/variant-2/",
          path: "p/source-name/variant-2/",
          shortDescription: "variant-short-desc"
        }
      ]);
    });

    it("should use simple product url if GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE provided", async () => {
      process.env.GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE = "true";

      expect(
        await Products.variantOptions.resolve(source, null, context)
      ).toEqual(
        EXPECTED_VARIANT_OPTIONS.map((option) => ({
          ...option,
          path: "p/simple-path"
        }))
      );
    });
  });

  describe("documents resolver", () => {
    const source: Node = {
      id: "source",
      internal: null,
      children: null,
      parent: null,
      name: "source-name",
      assets: [
        createAsset(),
        createAsset({
          name: "asset-2",
          allowedToDownload: true,
          fileSize: 1024
        }),
        createAsset({
          name: "asset-3",
          allowedToDownload: true,
          fileSize: 1024,
          mime: null
        }),
        createAsset({
          name: "asset-4",
          url: null
        }),
        createAsset({
          name: "asset-5",
          realFileName: null,
          allowedToDownload: true,
          fileSize: 1024
        })
      ]
    };
    it("should contain specific type", () => {
      expect(Products.documents.type).toEqual(["ProductDocument"]);
    });

    it("should resolve empty array if no assets provided", async () => {
      context.nodeModel.findAll = jest.fn().mockImplementation(() => {
        return { entries: [{ type: "parentFamily" }] };
      });
      expect(
        await Products.documents.resolve(
          { ...source, assets: null },
          null,
          context
        )
      ).toEqual([]);
    });

    it("should resolve documents", async () => {
      context.nodeModel.findAll = jest.fn().mockResolvedValue({
        entries: [
          {
            pimCode: "ASSEMBLY_INSTRUCTIONS",
            id: "asset-type-1",
            name: "asset-type-name-1"
          },
          { pimCode: "AWARDS", id: "asset-type-2", name: "asset-type-name-2" }
        ]
      });
      expect(await Products.documents.resolve(source, null, context)).toEqual([
        {
          assetType___NODE: "asset-type-1",
          children: [],
          docName: "asset-name",
          id: "source-nameasset-name",
          internal: {
            contentDigest: "6b297db19210d0cec3895913bb478aa4",
            owner: "@bmi/resolvers",
            type: "PIMLinkDocument"
          },
          isLinkDocument: true,
          parent: "source",
          product___NODE: "source",
          title: "source-name asset-type-name-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-1",
          children: [],
          docName: "asset-2",
          extension: "pdf",
          fileSize: 1024,
          format: "application/pdf",
          id: "source-nameasset-2",
          internal: {
            contentDigest: "781f5609b77255cd91ec194bc50a77ad",
            owner: "@bmi/resolvers",
            type: "PIMDocument"
          },
          isLinkDocument: false,
          parent: "source",
          product___NODE: "source",
          title: "source-name asset-type-name-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-1",
          children: [],
          docName: "asset-3",
          extension: "pdf",
          fileSize: 1024,
          format: "application/pdf",
          id: "source-nameasset-3",
          internal: {
            contentDigest: "cd70df25e587c9729126d1c0330802f0",
            owner: "@bmi/resolvers",
            type: "PIMDocument"
          },
          isLinkDocument: false,
          parent: "source",
          product___NODE: "source",
          title: "source-name asset-type-name-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        }
      ]);
    });
  });
});
