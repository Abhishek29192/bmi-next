import { baseUrlDomain, isProd, isSingleMarket } from ".";

const getDomainLocaleMapping = (domainCode) => ({
  [`${domainCode}.${baseUrlDomain}`]: domainCode
});

const redirectMapMultiMarket = {
  [baseUrlDomain]: "en",
  ...getDomainLocaleMapping("en"),
  ...getDomainLocaleMapping("no"),

  // these subdomains have not been set up yet
  ...(!isProd ? getDomainLocaleMapping("it") : {}),
  ...(!isProd ? getDomainLocaleMapping("de") : {}),
  ...(!isProd ? getDomainLocaleMapping("es") : {}),
  ...(!isProd ? getDomainLocaleMapping("us") : {})
};

export const redirectMap = isSingleMarket
  ? { localhost: "en" }
  : redirectMapMultiMarket;

export const redirectMapInverse = Object.keys(redirectMap)
  // best to redirect to subdomain
  .filter((el) => el !== baseUrlDomain)
  .reduce(
    (invMap, key) => ({
      ...invMap,
      [`${redirectMap[`${key}`]}`]: key
    }),
    {}
  );
