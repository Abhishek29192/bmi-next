import { Context } from "../../types/Gatsby";
import { getMicroCopies } from "../getMicrocopies";

const getNodesByIds = jest.fn();
const findOne = jest.fn();
const getNodeById = jest.fn();

const context: Context = {
  nodeModel: {
    getNodesByIds,
    findAll: jest.fn(),
    findOne,
    getNodeById
  }
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("getMicroCopies", () => {
  it("returns undefined if GATSBY_SPACE_MARKET_CODE does not exist", async () => {
    const initial = process.env.GATSBY_SPACE_MARKET_CODE;
    delete process.env.GATSBY_SPACE_MARKET_CODE;

    const res = await getMicroCopies(context);
    expect(res).toBe(undefined);
    expect(context.nodeModel.findOne).not.toHaveBeenCalled();
    expect(context.nodeModel.getNodeById).not.toHaveBeenCalled();
    expect(context.nodeModel.getNodesByIds).not.toHaveBeenCalled();
    process.env.GATSBY_SPACE_MARKET_CODE = initial;
  });

  it("returns undefined if NEXT_PUBLIC_MARKET_LOCALE_CODE does not exist", async () => {
    const initial = process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE;
    delete process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE;

    const res = await getMicroCopies(context);
    expect(res).toBe(undefined);
    expect(context.nodeModel.findOne).not.toHaveBeenCalled();
    expect(context.nodeModel.getNodeById).not.toHaveBeenCalled();
    expect(context.nodeModel.getNodesByIds).not.toHaveBeenCalled();
    process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE = initial;
  });

  it("returns undefined if contentful site does not exist", async () => {
    findOne.mockReturnValue(undefined);

    const res = await getMicroCopies(context);
    expect(res).toBe(undefined);
    expect(context.nodeModel.findOne).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.findOne).toHaveBeenCalledWith(
      {
        query: {
          filter: {
            countryCode: { eq: process.env.GATSBY_SPACE_MARKET_CODE },
            node_locale: { eq: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE }
          }
        },
        type: "ContentfulSite"
      },
      { connectionType: "ContentfulSite" }
    );
    expect(context.nodeModel.getNodeById).not.toHaveBeenCalled();
    expect(context.nodeModel.getNodesByIds).not.toHaveBeenCalled();
  });

  it("returns undefined if contentful resource does not exist", async () => {
    findOne.mockReturnValue({
      contentful_id: "site-contentful-id",
      resources___NODE: "resourceId"
    });
    getNodeById.mockReturnValue(undefined);

    const res = await getMicroCopies(context);
    expect(res).toBe(undefined);
    expect(context.nodeModel.findOne).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.findOne).toHaveBeenCalledWith(
      {
        query: {
          filter: {
            countryCode: { eq: process.env.GATSBY_SPACE_MARKET_CODE },
            node_locale: { eq: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE }
          }
        },
        type: "ContentfulSite"
      },
      { connectionType: "ContentfulSite" }
    );
    expect(context.nodeModel.getNodeById).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.getNodeById).toHaveBeenCalledWith({
      id: "resourceId",
      type: "ContentfulResources"
    });
    expect(context.nodeModel.getNodesByIds).not.toHaveBeenCalled();
  });

  it("returns microCopies", async () => {
    const microCopy = { key: "fake-micro-copy-key", value: "Fake value" };

    findOne.mockReturnValue({
      contentful_id: "site-contentful-id",
      resources___NODE: "resourceId"
    });
    getNodeById.mockReturnValue({
      microCopy___NODE: "micro-copy-node"
    });
    getNodesByIds.mockReturnValue([microCopy]);

    const res = await getMicroCopies(context);
    expect(res).toEqual([microCopy]);
    expect(context.nodeModel.findOne).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.findOne).toHaveBeenCalledWith(
      {
        query: {
          filter: {
            countryCode: { eq: process.env.GATSBY_SPACE_MARKET_CODE },
            node_locale: { eq: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE }
          }
        },
        type: "ContentfulSite"
      },
      { connectionType: "ContentfulSite" }
    );
    expect(context.nodeModel.getNodeById).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.getNodeById).toHaveBeenCalledWith({
      id: "resourceId",
      type: "ContentfulResources"
    });
    expect(context.nodeModel.getNodesByIds).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
      ids: "micro-copy-node",
      type: "ContentfulMicroCopy"
    });
  });
});
