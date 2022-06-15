import Systems from "../System";
import { Context, Node } from "../types/Gatsby";
import * as SystemsUtils from "../../../utils/systems";

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
  products: [{ code: "product-code-1" }]
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
          { ...source, products: null },
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
        .toHaveBeenCalledWith(`Couldn't find products that match [
  "product-code-1"
]
`);
    });
  });
});
