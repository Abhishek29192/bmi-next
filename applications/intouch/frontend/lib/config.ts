import { Role } from "@bmi/intouch-api-types";

export const ROLES: { [key: string]: Role } = {
  COMPANY_ADMIN: "COMPANY_ADMIN",
  INSTALLER: "INSTALLER",
  MARKET_ADMIN: "MARKET_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};

export const REDIRECT_MAP = {
  localhost: "en",
  "35.214.66.132": "en",
  "en.local.intouch": "en",
  "it.local.intouch": "it",
  "de.local.intouch": "de",
  "es.local.intouch": "es",
  "us.local.intouch": "us"
};
