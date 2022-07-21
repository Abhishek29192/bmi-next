import ContentfulSystemConfiguratorSection from "../ContentfulSystemConfiguratorSection";
import { Context, Node } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest
      .fn()
      .mockResolvedValueOnce({
        answers___NODE: ["answer-1", "answer-2"],
        internal: {
          type: "QuestionType"
        }
      })
      .mockImplementation(({ id }: { id: string }) => ({
        id,
        internal: {
          type: "ContentfulTitleWithContent"
        }
      })),
    getNodesByIds: jest.fn().mockResolvedValueOnce([
      {
        nextStep___NODE: "answer-1",
        internal: {
          type: "QuestionType"
        }
      },
      {
        nextStep___NODE: "answer-2",
        internal: {
          type: "QuestionType"
        }
      }
    ]),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
};

describe("ContentfulSystemConfiguratorSection resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulSystemConfiguratorSection.noResultItems.type).toEqual([
      "ContentfulTitleWithContent"
    ]);
  });
  it("should resolve ContentfulTitleWithContent", async () => {
    const source: Node = {
      id: "source",
      children: null,
      parent: null,
      internal: {
        type: "ContentfulTitleWithContent",
        contentDigest: "contentDigest",
        owner: "owner"
      },
      question___NODE: "question"
    };
    const result =
      await ContentfulSystemConfiguratorSection.noResultItems.resolve(
        source,
        null,
        context
      );
    expect(result).toEqual([source]);
  });
  it("should resolve ContentfulSystemConfiguratorSection", async () => {
    const source: Node = {
      id: "source",
      children: null,
      parent: null,
      __typename: "ContentfulSystemConfiguratorSection",
      internal: {
        type: "Section",
        contentDigest: "contentDigest",
        owner: "owner"
      },
      question___NODE: "question"
    };
    const result =
      await ContentfulSystemConfiguratorSection.noResultItems.resolve(
        source,
        null,
        context
      );
    expect(result).toEqual([]);
  });
  it("should resolve ContentfulSystemConfiguratorQuestion", async () => {
    const source: Node = {
      id: "source",
      children: null,
      parent: null,
      __typename: "ContentfulSystemConfiguratorQuestion",
      internal: {
        type: "Question",
        contentDigest: "contentDigest",
        owner: "owner"
      },
      answers___NODE: ["answer1", "answer2"]
    };
    const result =
      await ContentfulSystemConfiguratorSection.noResultItems.resolve(
        source,
        null,
        context
      );
    expect(result).toEqual([]);
  });
  it("should resolve ContentfulSystemConfiguratorAnswer", async () => {
    const source: Node = {
      id: "question",
      children: null,
      parent: null,
      __typename: "ContentfulSystemConfiguratorAnswer",
      internal: {
        type: "Answer",
        contentDigest: "contentDigest",
        owner: "owner"
      },
      nextStep___NODE: "question"
    };
    const result =
      await ContentfulSystemConfiguratorSection.noResultItems.resolve(
        source,
        null,
        context
      );
    expect(result).toEqual([
      {
        id: "question",
        internal: {
          type: "ContentfulTitleWithContent"
        }
      }
    ]);
  });
});
