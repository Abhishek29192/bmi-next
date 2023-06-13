import { createSystem, createSystemDocument } from "@bmi/firestore-types";
import Systems from "../System";
import { Context, Node, ResolveArgs } from "../types/Gatsby";

jest.mock("../../../utils/systems");

jest.mock("../utils/getDefaultYoutubePreviewImage", () => ({
  getDefaultYoutubePreviewImage: () =>
    "https://i.ytimg.com/vi/3901c0ds7oo/maxresdefault.jpg"
}));

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
  children: [],
  parent: null,
  internal: { type: "", contentDigest: "", owner: "" },
  relatedProducts: ["product-code-1"]
};

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

describe("ContentfulServiceLocatorSection resolver", () => {
  it("should contain specific type", () => {
    expect(Systems.relatedProducts.type).toEqual(["Product"]);
    expect(Systems.relatedOptionalProducts.type).toEqual(["Product"]);
  });

  describe("createResolver", () => {
    it("should handle empty sourceField", async () => {
      expect(
        await Systems.relatedProducts.resolve(
          { ...source, relatedProducts: null },
          args,
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
        await Systems.relatedProducts.resolve(source, args, context)
      ).toEqual(products);
    });

    it("should warn if no products found for any variant codes", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });
      jest.spyOn(console, "warn");

      expect(
        await Systems.relatedProducts.resolve(source, args, context)
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
      const source = createSystem({ documents: undefined });

      expect(await Systems.documents.resolve(source, args, context)).toEqual(
        []
      );
    });
    it("should not resolve documents if system documents list is empty array", async () => {
      const source = createSystem({ documents: [] });

      expect(await Systems.documents.resolve(source, args, context)).toEqual(
        []
      );
    });
    it("should not resolve documents if matching asset type is not found", async () => {
      const source = createSystem({
        documents: [createSystemDocument({ assetType: "AWARDS" })]
      });
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [{ pimCode: "BMI" }] });

      expect(await Systems.documents.resolve(source, args, context)).toEqual(
        []
      );
    });
    it("should resolve documents if documents with matching asset types were found", async () => {
      const source = createSystem({
        documents: [createSystemDocument({ assetType: "AWARDS" })]
      });
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: [
          { pimCode: "AWARDS", code: "AWRD", name: "Awards", id: "AWARD_ID" }
        ]
      });

      expect(await Systems.documents.resolve(source, args, context)).toEqual([
        {
          extension: "pdf",
          fileSize: 10,
          format: "application/pdf",
          id: "id-1",
          isLinkDocument: false,
          realFileName: "real-file-name.pdf",
          title: "title",
          url: "http://localhost:8000/real-file-name.pdf",
          assetType: {
            pimCode: "AWARDS",
            code: "AWRD",
            id: "AWARD_ID",
            name: "Awards"
          }
        }
      ]);
    });
  });

  describe("resolve relatedSystems tests", () => {
    it("should not resolve relatedSystems if systemReferences is null", async () => {
      const source = createSystem({ systemReferences: undefined });

      expect(
        await Systems.relatedSystems.resolve(source, args, context)
      ).toEqual([]);
    });
    it("should not resolve relatedSystems if systemReferences are empty list", async () => {
      const source = createSystem({ systemReferences: [] });

      expect(
        await Systems.relatedSystems.resolve(source, args, context)
      ).toEqual([]);
    });

    it("should not resolve relatedSystems if matching systems are not found", async () => {
      const source = createSystem({ systemReferences: ["test-reference"] });
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });

      expect(
        await Systems.relatedSystems.resolve(source, args, context)
      ).toEqual([]);
    });
    it("should resolve relatedSystems if matching systems are found", async () => {
      const source = createSystem({ systemReferences: ["test-reference"] });
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: [
          { name: "system-2", code: "test-reference" },
          { name: "system-3", code: "test-reference" },
          { name: "system-4", code: "test-reference" }
        ]
      });

      expect(
        await Systems.relatedSystems.resolve(source, args, context)
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
        const source = createSystem({ systemReferences: ["test-reference"] });
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
          await Systems.relatedSystems.resolve(source, args, context)
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
        const source = createSystem({ systemReferences: ["test-reference"] });
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
          await Systems.relatedSystems.resolve(source, args, context)
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

  describe("video resolver", () => {
    it("should return video data from product", async () => {
      const source = createSystem();

      const result = await Systems.videos.resolve(source, args, context);

      expect(result).toEqual([
        {
          __typename: "PimVideo",
          defaultYouTubePreviewImage:
            "https://i.ytimg.com/vi/3901c0ds7oo/maxresdefault.jpg",
          label: "name",
          previewMedia: null,
          subtitle: null,
          title: "",
          videoRatio: null,
          videoUrl: "https://www.youtube.com/watch?v=3901c0ds7oo"
        }
      ]);
    });
  });
});
