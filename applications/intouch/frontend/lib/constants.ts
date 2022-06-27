import { BusinessType, Operation, Role, Tier } from "@bmi/intouch-api-types";

export const ROLES: { [key: string]: Role } = {
  COMPANY_ADMIN: "COMPANY_ADMIN",
  INSTALLER: "INSTALLER",
  MARKET_ADMIN: "MARKET_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  AUDITOR: "AUDITOR"
};

export const BUSINESS_TYPES: { [key: string]: BusinessType } = {
  CONTRACTOR: "CONTRACTOR",
  ARCHITECT: "ARCHITECT",
  MERCHANT: "MERCHANT",
  CORP_DEVELOPER: "CORP_DEVELOPER"
};

export const OPERATION_TYPES: { [key: string]: Operation } = {
  FLAT: "FLAT",
  PITCHED: "PITCHED",
  SOLAR: "SOLAR",
  BITUMEN: "BITUMEN",
  TILE: "TILE",
  COATER: "COATER",
  GREEN: "GREEN"
};

export const TIERS: { [key: string]: Tier } = {
  T1: "T1",
  T2: "T2",
  T3: "T3",
  T4: "T4"
};
