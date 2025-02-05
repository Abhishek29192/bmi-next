export type Auth0IdTokenPayload = {
  at_hash: string;
  aud: string;
  email: string;
  email_verified: boolean;
  "https://intouch/first_name": string;
  "https://intouch/intouch_market_code": string;
  "https://intouch/intouch_role": string;
  "https://intouch/last_name": string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  nonce: string;
  picture: string;
  sid: string;
  sub: string;
  updated_at: string;
};
