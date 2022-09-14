export const parseMarketCompanyTag = (market: string) => {
  // TODO: Change tags system names in contentful in future to be same as domain. market__my
  const tags = {
    en: "market__endor",
    dk: "market__denmark",
    de: "market__germany",
    it: "market__italy",
    no: "market__norway",
    pt: "market__portugal",
    es: "market__spain",
    fi: "market__finland",
    my: "market__malaysia"
  };
  // eslint-disable-next-line security/detect-object-injection
  return tags[market] || "market__endor";
};
