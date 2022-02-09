import ContentfulHomePage from "../ContentfulHomePage";
import { Context } from "../types";

const context: Context = {
  nodeModel: {
    getAllNodes: jest
      .fn()
      .mockResolvedValue([{ type: "ContentfulBrandLandingPage" }]),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    runQuery: jest.fn()
  }
};

describe("ContentfulHomePage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulHomePage.brands.type).toEqual([
      "ContentfulBrandLandingPage"
    ]);
  });
  it("should resolve slug", () => {
    expect(ContentfulHomePage.slug.resolve()).toBe("/");
  });
  it("should resolve path", () => {
    expect(ContentfulHomePage.path.resolve()).toBe("/");
  });
  it("should resolve brands", async () => {
    expect(
      await ContentfulHomePage.brands.resolve(null, null, context)
    ).toEqual([{ type: "ContentfulBrandLandingPage" }]);
  });
});
