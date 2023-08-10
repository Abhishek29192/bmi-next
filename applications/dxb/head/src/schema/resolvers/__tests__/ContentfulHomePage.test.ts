import ContentfulHomePage from "../ContentfulHomePage";
import { Context, Node, ResolveArgs } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    findAll: jest
      .fn()
      .mockResolvedValue({ entries: [{ type: "ContentfulBrandLandingPage" }] }),
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

describe("ContentfulHomePage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulHomePage.brands.type).toEqual(
      "[ContentfulBrandLandingPage]!"
    );
  });
  it("should resolve slug", () => {
    expect(ContentfulHomePage.slug.resolve()).toBe("/");
  });
  it("should resolve path", () => {
    expect(ContentfulHomePage.path.resolve()).toBe("/");
  });
  it("should resolve brands", async () => {
    expect(
      await ContentfulHomePage.brands.resolve(source, args, context)
    ).toEqual([{ type: "ContentfulBrandLandingPage" }]);
  });
});
