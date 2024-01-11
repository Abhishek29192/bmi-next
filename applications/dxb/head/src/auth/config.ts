export const config = {
  domain: process.env.GATSBY_AUTH0_DOMAIN!,
  clientID: process.env.GATSBY_AUTH0_CLIENT_ID!,
  redirectUri: process.env.GATSBY_AUTH0_CALLBACK_URL!,
  audience: process.env.GATSBY_AUTH0_AUDIENCE!,
  responseType: process.env.GATSBY_AUTH0_RESPONSE_TYPE || "token id_token",
  scope: process.env.GATSBY_AUTH0_SCOPE || "openid email profile"
};
