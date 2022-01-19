import ContentfulPage from "../ContentfulPage";
import { Context, Node } from "../types";

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
    getAllNodes: jest.fn(),
    getNodeById: jest.fn().mockResolvedValue({ subtitle: "subtitle" }),
    getNodesByIds: jest.fn(),
    runQuery: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  subtitle: "source-subtitle",
  subtitle___NODE: "source-subtitle-node"
};

describe("ContentfulPage resolver", () => {
  it("should contain specific page types", () => {
    expect(Object.keys(ContentfulPage)).toEqual([
      "ContentfulSimplePage",
      "ContentfulContactUsPage",
      "ContentfulProductListerPage",
      "ContentfulDocumentLibraryPage",
      "ContentfulBrandLandingPage"
    ]);
  });
  it("should resolve path", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].path.resolve(
        source,
        null,
        context
      )
    ).toBe("/path/to/some/page");
  });
  it("should resolve breadcrumbs", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].breadcrumbs.resolve(
        source,
        null,
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
        null,
        context
      )
    ).toBe("source-subtitle");
  });

  it("should return null if no subtitle___NODE provided", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].subtitle.resolve(
        { ...source, subtitle___NODE: null },
        null,
        context
      )
    ).toBeNull();
  });

  it("should resolve subtitle for ContentfulSimplePage", async () => {
    expect(
      await ContentfulPage["ContentfulSimplePage"].subtitle.resolve(
        source,
        null,
        context
      )
    ).toBe("subtitle");
  });
});
