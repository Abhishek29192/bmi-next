type User = {
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
};