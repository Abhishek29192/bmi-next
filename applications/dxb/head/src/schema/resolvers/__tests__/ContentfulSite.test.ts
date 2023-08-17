import ContentfulSite from "../ContentfulSite";
import { Context, ResolveArgs, Node } from "../types/Gatsby";

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

const source: Node = {
  id: "source",
  children: [],
  parent: null,
  internal: { type: "", contentDigest: "", owner: "" }
};

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

describe("ContentfulSite resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulSite.regions.type).toEqual(["RegionJson"]);
  });
  it("should resolve regions", async () => {
    expect(await ContentfulSite.regions.resolve(source, args, context)).toEqual(
      [{ type: "ContentfulSite" }]
    );

    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      { query: {}, type: "RegionJson" },
      { connectionType: "RegionJson" }
    );
  });
});
