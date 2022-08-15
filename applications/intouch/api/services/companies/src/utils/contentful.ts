export const parseMarketCompanyTag = (market: string) => {
  const { CONTENTFUL_TAGS = "{}" } = process.env;
  try {
    const marketsContentfulMap = JSON.parse(CONTENTFUL_TAGS);
    // eslint-disable-next-line security/detect-object-injection
    return marketsContentfulMap[market] || "en";
  } catch (e) {
    return "en";
  }
};
