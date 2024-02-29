import { Auth0IdTokenPayload } from "../../../../types/auth0";

const createAuth0IdTokenPayload = (
  auth0IdTokenPayload?: Partial<Auth0IdTokenPayload>
): Auth0IdTokenPayload => ({
  at_hash: "UcmWwDkQeu_VPFbVXQmBKQ",
  aud: "4Btu7StZO5JZNVZ3Z7Qnt8T6rnoCJymw",
  email: "test@test.com",
  email_verified: true,
  "https://intouch/first_name": "Test First",
  "https://intouch/intouch_market_code": "no",
  "https://intouch/intouch_role": "TEST_USER",
  "https://intouch/last_name": "Test Last",
  exp: 1705700265,
  iat: 1705664265,
  iss: "https://dev-78gkj0yx.eu.auth0.com/",
  name: "test@test.com",
  nickname: "Test Nickname",
  nonce: "b_dg8GmRUr17XGek9tU_EJg9Z.feD6Xu",
  picture: "https://localhost/picture.jpg",
  sid: "r5N17_b8XvnhpjLOFCSFoO0qerGOemUT",
  sub: "auth0|618e8bf13fc0730068123c00",
  updated_at: "2024-01-19T11:32:10.379Z",
  ...auth0IdTokenPayload
});

export default createAuth0IdTokenPayload;
