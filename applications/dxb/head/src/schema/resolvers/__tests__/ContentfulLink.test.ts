import ContentfulLink from "../ContentfulLink";
import { Context, Node } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn().mockResolvedValue({
      tileId: 0,
      colourId: "test",
      sidingId: -1,
      viewMode: "tile"
    }),
    getNodesByIds: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  parameters___NODE: "parameters-1"
};

describe("ContentfulLink resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulLink.parameters.type).toBe(
      "ContentfulLinkParametersJsonNode"
    );
  });
  it("should return null for source without parameters___NODE", async () => {
    expect(
      await ContentfulLink.parameters.resolve(
        { ...source, parameters___NODE: null },
        null,
        context
      )
    ).toBeNull();
  });

  it("should return null for invalid types", async () => {
    expect(
      await ContentfulLink.parameters.resolve(
        { ...source, type: "Invalid" },
        null,
        context
      )
    ).toBeNull();
  });

  it("should resolve link for Visualiser type", async () => {
    expect(
      await ContentfulLink.parameters.resolve(
        { ...source, type: "Visualiser" },
        null,
        context
      )
    ).toEqual({
      children: [],
      colourId: null,
      id: "parameters-1",
      internal: {
        contentDigest: "eabfa4094139161906a36ee8ac607fc9",
        owner: "@bmi/resolvers",
        type: "ContentfulLinkParametersJsonNode"
      },
      parent: "source",
      sidingId: null,
      tileId: 0,
      viewMode: "tile"
    });
  });
  it("should resolve link with default viewMode", async () => {
    context.nodeModel.getNodeById = jest.fn().mockResolvedValue({
      tileId: 0,
      colourId: 0,
      sidingId: 0
    });
    expect(
      await ContentfulLink.parameters.resolve(
        { ...source, type: "Visualiser" },
        null,
        context
      )
    ).toEqual({
      children: [],
      colourId: 0,
      id: "parameters-1",
      internal: {
        contentDigest: "03a6cee09f5c226c52492343465177ff",
        owner: "@bmi/resolvers",
        type: "ContentfulLinkParametersJsonNode"
      },
      parent: "source",
      sidingId: 0,
      tileId: 0,
      viewMode: "tile"
    });
  });

  it("should resolve link for ivalid viewMode", async () => {
    context.nodeModel.getNodeById = jest.fn().mockResolvedValue({
      tileId: 0,
      colourId: 0,
      sidingId: 0,
      viewMode: -1
    });
    expect(
      await ContentfulLink.parameters.resolve(
        { ...source, type: "Visualiser" },
        null,
        context
      )
    ).toEqual({
      children: [],
      colourId: 0,
      id: "parameters-1",
      internal: {
        contentDigest: "03a6cee09f5c226c52492343465177ff",
        owner: "@bmi/resolvers",
        type: "ContentfulLinkParametersJsonNode"
      },
      parent: "source",
      sidingId: 0,
      tileId: 0,
      viewMode: "tile"
    });
  });
});
