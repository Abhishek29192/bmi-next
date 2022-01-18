import ContentfulServiceLocatorSection from "../ContentfulServiceLocatorSection";
import { Context, Node } from "../types";

const context: Context = {
  nodeModel: {
    getAllNodes: jest.fn(),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    runQuery: jest
      .fn()
      .mockResolvedValue([{ type: "ContentfulServiceLocatorSection" }])
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  type: "type"
};

describe("ContentfulServiceLocatorSection resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulServiceLocatorSection.services.type).toEqual([
      "ContentfulService"
    ]);
  });
  it("should resolve service locator sections", async () => {
    expect(
      await ContentfulServiceLocatorSection.services.resolve(
        source,
        null,
        context
      )
    ).toEqual([{ type: "ContentfulServiceLocatorSection" }]);

    expect(context.nodeModel.runQuery).toHaveBeenCalledWith(
      {
        firstOnly: false,
        query: { filter: { entryType: { eq: "type" } } },
        type: "ContentfulService"
      },
      { connectionType: "ContentfulService" }
    );
  });
});
