import ContentfulServiceLocatorSection from "../ContentfulServiceLocatorSection";
import { Context, Node } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn().mockResolvedValue({
      entries: [{ type: "ContentfulServiceLocatorSection" }]
    }),
    findOne: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  type: "type",
  node_locale: "en-GB"
};

describe("ContentfulServiceLocatorSection resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulServiceLocatorSection.services.type).toEqual([
      "ContentfulService"
    ]);
  });
  it("should resolve service locator sections", async () => {
    process.env.GATSBY_MARKET_LOCALE_CODE = "en-GB";
    expect(
      await ContentfulServiceLocatorSection.services.resolve(
        source,
        null,
        context
      )
    ).toEqual([{ type: "ContentfulServiceLocatorSection" }]);

    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {
          filter: { entryType: { eq: "type" }, node_locale: { eq: "en-GB" } }
        },
        type: "ContentfulService"
      },
      { connectionType: "ContentfulService" }
    );
    process.env.GATSBY_MARKET_LOCALE_CODE = "";
  });

  it("should use MARKET_TAG_NAME if provided", async () => {
    process.env.MARKET_TAG_NAME = "market__test";
    expect(
      await ContentfulServiceLocatorSection.services.resolve(
        source,
        null,
        context
      )
    ).toEqual([{ type: "ContentfulServiceLocatorSection" }]);

    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {
          filter: { entryType: { eq: "type" }, node_locale: { eq: "en-GB" } }
        },
        type: "ContentfulService"
      },
      { connectionType: "ContentfulService" }
    );

    process.env.MARKET_TAG_NAME = "";
  });

  it("should return empty array if no  services found", async () => {
    (context.nodeModel.findAll as jest.Mock).mockReturnValue({ entries: [] });

    expect(
      await ContentfulServiceLocatorSection.services.resolve(
        source,
        null,
        context
      )
    ).toEqual([]);
  });
});
