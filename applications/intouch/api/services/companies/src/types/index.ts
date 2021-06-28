import { Role } from "@bmi/intouch-api-types";

export type Account = {
  companyId: string;
  intouchUserId: string;
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
  marketId: string;
  status: string;
  doceboUserId: string;
  doceboUsername: string;
  migrationId: string;
};
