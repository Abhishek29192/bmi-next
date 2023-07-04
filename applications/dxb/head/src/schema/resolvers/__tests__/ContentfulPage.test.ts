import ContentfulPage from "../ContentfulPage";
import { Context, Node, ResolveArgs } from "../types/Gatsby";

jest.mock("../utils/path", () => ({
  resolvePath: jest
    .fn()
    .mockResolvedValue([
      { id: "page", path: "/path/to/some/page", label: "label", slug: "slug" }
    ]),
  getUrlFromPath: jest.fn().mockReturnValue("/path/to/some/page")
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
  subtitle: "source-subtitle",
  subtitle___NODE: "source-subtitle-node"
};

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

describe("ContentfulPage resolver", () => {
  it("should contain specific page types", () => {
    expect(Object.keys(ContentfulPage)).toEqual([
      "ContentfulSimplePage",
      "ContentfulContactUsPage",
      "ContentfulProductListerPage",
      "ContentfulDocumentLibraryPage",
      "ContentfulBrandLandingPage",
      "ContentfulCookiePolicyPage"
    ]);
  });
  it("should resolve path", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].path.resolve(
        source,
        args,
        context
      )
    ).toBe("/path/to/some/page");
  });
  it("should resolve breadcrumbs", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].breadcrumbs.resolve(
        source,
        args,
        context
      )
    ).toEqual([
      { id: "page", path: "/path/to/some/page", label: "label", slug: "slug" }
    ]);
  });
  it("should resolve subtitle from source", async () => {
    expect(
      await ContentfulPage["ContentfulContactUsPage"].subtitle.resolve(
        source,
        args,
        context
      )
    ).toBe("source-subtitle");
  });

  it("should return null if no subtitle___NODE provided", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].subtitle.resolve(
        { ...source, subtitle___NODE: undefined },
        args,
        context
      )
    ).toBeNull();
  });

  it("should resolve subtitle for ContentfulSimplePage", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].subtitle.resolve(
        source,
        args,
        context
      )
    ).toBe("subtitle");
  });
});
