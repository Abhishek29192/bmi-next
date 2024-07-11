const getTagFilter = () =>
  process.env.MARKET_TAG_NAME
    ? {
        contentfulMetadata: {
          tags: {
            id_contains_all: [process.env.MARKET_TAG_NAME]
          }
        }
      }
    : {};

export default getTagFilter;
