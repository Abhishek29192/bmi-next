import { gql } from "apollo-server";

export default gql`
  extend type Query {
    token: TokenInfo
    tokenByJwtPayload(username: String!): TokenInfo
  }

  type TokenInfo {
    access_token: String
    expires_in: Int
    token_type: String
    scope: String
    refresh_token: String!
  }
`;
