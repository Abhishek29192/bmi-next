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

    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: { filter: { entryType: { eq: "type" } } },
        type: "ContentfulService"
      },
      { connectionType: "ContentfulService" }
    );
  });
});
