import { BusinessType, Role } from "@bmi/intouch-api-types";

export const ROLES: { [key: string]: Role } = {
  COMPANY_ADMIN: "COMPANY_ADMIN",
  INSTALLER: "INSTALLER",
  MARKET_ADMIN: "MARKET_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};

export const BUSINESS_TYPES: { [key: string]: BusinessType } = {
  CONTRACTOR: "CONTRACTOR",
  ARCHITECT: "ARCHITECT",
  MERCHANT: "MERCHANT",
  CORP_DEVELOPER: "CORP_DEVELOPER"
};
