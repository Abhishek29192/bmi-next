import ContentfulSystemConfiguratorBlock from "../ContentfulSystemConfiguratorBlock";
import { Context, Node } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest
      .fn()
      .mockResolvedValueOnce({
        type: "Question",
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
        type: "Answer",
        nextStep___NODE: "answer-1",
        internal: {
          type: "QuestionType"
        }
      },
      {
        type: "Answer",
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

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: {
    type: "ContentfulTitleWithContent",
    contentDigest: "contentDigest",
    owner: "owner"
  },
  type: "Section",
  question___NODE: "question"
};

describe("ContentfulSystemConfiguratorBlock resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulSystemConfiguratorBlock.noResultItems.type).toEqual([
      "ContentfulTitleWithContent"
    ]);
  });
  it("should resolve regions", async () => {
    expect(
      await ContentfulSystemConfiguratorBlock.noResultItems.resolve(
        source,
        null,
        context
      )
    ).toEqual([
      source,
      {
        id: "answer-1",
        internal: {
          type: "ContentfulTitleWithContent"
        }
      },
      {
        id: "answer-2",
        internal: {
          type: "ContentfulTitleWithContent"
        }
      }
    ]);
  });
});
