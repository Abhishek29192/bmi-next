import ContentfulSite from "../ContentfulSite";
import { Context } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    findAll: jest
      .fn()
      .mockResolvedValue({ entries: [{ type: "ContentfulSite" }] }),
    findOne: jest.fn(),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn()
  }
};

describe("ContentfulSite resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulSite.regions.type).toEqual(["RegionJson"]);
  });
  it("should resolve regions", async () => {
    expect(await ContentfulSite.regions.resolve(null, null, context)).toEqual([
      { type: "ContentfulSite" }
    ]);

    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      { query: {}, type: "RegionJson" },
      { connectionType: "RegionJson" }
    );
  });
});
