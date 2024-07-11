import getTagFilter from "../getTagFilter";

describe("getTagFilter", () => {
  it("should return an empty object if MARKET_TAG_NAME is an empty string", () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    process.env.MARKET_TAG_NAME = "";
    expect(getTagFilter()).toEqual({});
    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });

  it("should return an empty object if MARKET_TAG_NAME does not exist", () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    delete process.env.MARKET_TAG_NAME;
    expect(getTagFilter()).toEqual({});
    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });

  it("should return the correct filter object if MARKET_TAG_NAME is set", () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    const tagName = "testTag";
    process.env.MARKET_TAG_NAME = tagName;

    expect(getTagFilter()).toEqual({
      contentfulMetadata: {
        tags: {
          id_contains_all: [tagName]
        }
      }
    });
    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });
});
