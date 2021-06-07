type User = {
  company_id: string;
  id: string;
  email: string;
  role: RolesKey;
  iss: string; // Issuer
  iat: number; // Issued at time
  exp: number; // Expiration time
  nbf: number; // Not before time
  aud: string; // Audience
  sub: string; // Subject user id in auth0 "provider|id" es "auth0|1234567890"
  scope: string | string[]; // Scope requested
  market_id: string;
  status: string;
  docebo_user_id: string;
  docebo_username: string;
  migration_id: string;
};
