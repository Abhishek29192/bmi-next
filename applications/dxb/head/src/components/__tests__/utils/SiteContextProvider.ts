export const getMockSiteContext = (
  countryCode: string = "en",
  nodeLocale: string = "en-GB"
) => ({
  countryCode: countryCode,
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: nodeLocale,
  homePage: {
    title: "Home page title"
  }
});
