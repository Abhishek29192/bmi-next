import { baseUrlDomain } from ".";

const getDomainLocaleMapping = (domainCode) => ({
  [`${domainCode}.${baseUrlDomain}`]: domainCode
});

export const redirectMap = {
  [baseUrlDomain]: "en",
  ...getDomainLocaleMapping("en"),
  ...getDomainLocaleMapping("no"),
  ...getDomainLocaleMapping("dev-en"),
  ...getDomainLocaleMapping("dev-no")
};

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
