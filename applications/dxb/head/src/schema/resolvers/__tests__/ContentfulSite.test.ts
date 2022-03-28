import ContentfulSite from "../ContentfulSite";
import { Context } from "../types";

const context: Context = {
  nodeModel: {
    getAllNodes: jest.fn().mockResolvedValue([{ type: "ContentfulSite" }]),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn()
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

    expect(context.nodeModel.getAllNodes).toHaveBeenCalledWith(
      { type: "RegionJson" },
      { connectionType: "RegionJson" }
    );
  });
});
