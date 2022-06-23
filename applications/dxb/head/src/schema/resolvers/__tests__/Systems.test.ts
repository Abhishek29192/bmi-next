import { System } from "@bmi/firestore-types";
import * as SystemsUtils from "../../../utils/systems";
import Systems from "../System";
import { Context, Node } from "../types/Gatsby";

jest.mock("../../../utils/systems");

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn().mockResolvedValue({ subtitle: "subtitle" }),
    getNodesByIds: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  relatedProducts: ["product-code-1"]
};

describe("ContentfulServiceLocatorSection resolver", () => {
  it("should contain specific type", () => {
    expect(Systems.relatedProducts.type).toEqual(["Product"]);
    expect(Systems.relatedOptionalProducts.type).toEqual(["Product"]);
  });

  describe("path", () => {
    it("should resolve path", async () => {
      const path = "some-path";
      jest.spyOn(SystemsUtils, "generateSystemPath").mockReturnValue(path);

      expect(await Systems.path.resolve(source)).toEqual(path);
      expect(SystemsUtils.generateSystemPath).toHaveBeenCalledWith(source);
    });
  });

  describe("createResolver", () => {
    it("should handle empty sourceField", async () => {
      expect(
        await Systems.relatedProducts.resolve(
          { ...source, relatedProducts: null },
          null,
          context
        )
      ).toEqual([]);
    });

    it("should resolve products", async () => {
      const products = [{ product: "product-1" }];
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: products });

      expect(
        await Systems.relatedProducts.resolve(source, null, context)
      ).toEqual(products);
    });

    it("should warn if some variant code found", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });
      jest.spyOn(console, "warn");

      expect(
        await Systems.relatedProducts.resolve(source, null, context)
      ).toEqual([]);
      // eslint-disable-next-line no-console
      expect(console.warn)
        .toHaveBeenCalledWith(`Couldn't find relatedProducts that match [
  "product-code-1"
]
`);
    });
  });

  describe("resolve documents tests", () => {
    it("should not resolve documents if system documents are null", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: null,
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };

      expect(await Systems.documents.resolve(source, null, context)).toEqual(
        []
      );
    });
    it("should not resolve documents if system documents list is empty array", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };

      expect(await Systems.documents.resolve(source, null, context)).toEqual(
        []
      );
    });
    it("should not resolve documents if matching asset type is not found", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [
          {
            id: "doc-1",
            assetType: "AWARDS",
            isLinkDocument: false,
            title: "docu-1-title",
            url: "http://some-url"
          }
        ],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [{ pimCode: "BMI" }] });

      expect(await Systems.documents.resolve(source, null, context)).toEqual(
        []
      );
    });
    it("should resolve documents if documents with matching asset types were found", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [
          {
            id: "doc-1",
            assetType: "AWARDS",
            isLinkDocument: false,
            title: "docu-1-title",
            url: "http://some-url"
          }
        ],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [{ pimCode: "AWARDS" }] });

      expect(await Systems.documents.resolve(source, null, context)).toEqual([
        {
          assetType: "AWARDS",
          id: "doc-1",
          isLinkDocument: false,
          title: "docu-1-title",
          url: "http://some-url"
        }
      ]);
    });
  });

  describe("resolve relatedSystems tests", () => {
    it("should not resolve relatedSystems if systemReferences is null", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: null,
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };

      expect(
        await Systems.relatedSystems.resolve(source, null, context)
      ).toEqual([]);
    });
    it("should not resolve relatedSystems if systemReferences are empty list", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: [],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };

      expect(
        await Systems.relatedSystems.resolve(source, null, context)
      ).toEqual([]);
    });

    it("should not resolve relatedSystems if matching systems are not found", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: ["test-reference"],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });

      expect(
        await Systems.relatedSystems.resolve(source, null, context)
      ).toEqual([]);
    });
    it("should resolve relatedSystems if matching systems are found", async () => {
      const source: System = {
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        categories: [],
        code: "system-1",
        description: "system-1-description",
        documents: [],
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        images: [],
        layerCodes: [],
        name: "system-1-name",
        scoringWeight: 0.5,
        shortDescription: "system-1-short-description",
        systemReferences: ["test-reference"],
        uniqueSellingPropositions: [],
        videos: [],
        classifications: []
      };
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: [
          { name: "system-2", code: "test-reference" },
          { name: "system-3", code: "test-reference" },
          { name: "system-4", code: "test-reference" }
        ]
      });

      expect(
        await Systems.relatedSystems.resolve(source, null, context)
      ).toEqual([
        {
          code: "test-reference",
          name: "system-2"
        },
        {
          code: "test-reference",
          name: "system-3"
        },
        {
          code: "test-reference",
          name: "system-4"
        }
      ]);
    });

    describe("relatedSystems order tests", () => {
      it("should resolve relatedSystems in order of scoringweight", async () => {
        const source: System = {
          awardsAndCertificateDocuments: [],
          awardsAndCertificateImages: [],
          categories: [],
          code: "system-1",
          description: "system-1-description",
          documents: [],
          guaranteesAndWarrantiesImages: [],
          guaranteesAndWarrantiesLinks: [],
          images: [],
          layerCodes: [],
          name: "system-1-name",
          scoringWeight: 0.5,
          shortDescription: "system-1-short-description",
          systemReferences: ["test-reference"],
          uniqueSellingPropositions: [],
          videos: [],
          classifications: []
        };
        context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
          entries: [
            {
              name: "system-2",
              code: "test-reference",
              scoringWeight: 8
            },
            {
              name: "system-3",
              code: "test-reference",
              scoringWeight: 9
            },
            {
              name: "system-4",
              code: "test-reference",
              scoringWeight: 10
            }
          ]
        });

        expect(
          await Systems.relatedSystems.resolve(source, null, context)
        ).toEqual([
          {
            code: "test-reference",
            name: "system-4",
            scoringWeight: 10
          },
          {
            code: "test-reference",
            name: "system-3",
            scoringWeight: 9
          },
          {
            code: "test-reference",
            name: "system-2",
            scoringWeight: 8
          }
        ]);
      });

      it("should resolve relatedSystems in order of name if same scoring weight found", async () => {
        const source: System = {
          awardsAndCertificateDocuments: [],
          awardsAndCertificateImages: [],
          categories: [],
          code: "system-1",
          description: "system-1-description",
          documents: [],
          guaranteesAndWarrantiesImages: [],
          guaranteesAndWarrantiesLinks: [],
          images: [],
          layerCodes: [],
          name: "system-1-name",
          scoringWeight: 0.5,
          shortDescription: "system-1-short-description",
          systemReferences: ["test-reference"],
          uniqueSellingPropositions: [],
          videos: [],
          classifications: []
        };
        context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
          entries: [
            {
              name: "system-2",
              code: "test-reference",
              scoringWeight: 8
            },
            {
              name: "system-3",
              code: "test-reference",
              scoringWeight: 9
            },
            {
              name: "p-system-3",
              code: "test-reference",
              scoringWeight: 9
            },
            {
              name: "system-4",
              code: "test-reference",
              scoringWeight: 10
            }
          ]
        });

        expect(
          await Systems.relatedSystems.resolve(source, null, context)
        ).toEqual([
          {
            code: "test-reference",
            name: "system-4",
            scoringWeight: 10
          },
          {
            code: "test-reference",
            name: "p-system-3",
            scoringWeight: 9
          },
          {
            code: "test-reference",
            name: "system-3",
            scoringWeight: 9
          },
          {
            code: "test-reference",
            name: "system-2",
            scoringWeight: 8
          }
        ]);
      });
    });
  });
});
