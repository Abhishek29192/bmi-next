import { PoolClient } from "pg";
import { Role, Company, Market } from "@bmi/intouch-api-types";

export type Account = {
  id: string;
  companyId: string;
  email: string;
  role: Role;
  iss: string; // Issuer
  iat: number; // Issued at time
  exp: number; // Expiration time
  nbf: number; // Not before time
  aud: string; // Audience
  sub: string; // Subject user id in auth0 "provider|id" es "auth0|1234567890"
  scope: string | string[]; // Scope requested
  invited: boolean;
  firstName: string;
  lastName: string;
  market: Market;
  status: string;
  doceboUserId: string;
  doceboUsername: string;
  migrationId: string;
  marketId: string;
  company: Company;
  can: (permissions: string | string[]) => boolean;
};

export type PostGraphileContext = {
  pubSub: any;
  user: Account;
  logger: (modue: string) => import("winston").Logger;
  pgRootPool: PoolClient;
};
