import localeAccount from "../locales/account.json";

const { APP_ENV } = process.env;

export const getTranslatedRole = (locale: string, role: string): string => {
  return (
    // eslint-disable-next-line security/detect-object-injection
    localeAccount[locale]?.roles[role] || role?.toLowerCase().replace("_", " ")
  );
};

export const getTargetDomain = (marketDomain) => {
  return APP_ENV === "prod" ? marketDomain : `${APP_ENV}-${marketDomain}`;
};
