import { gql } from "graphile-utils";

export default gql`
  type SSOUrlOutput {
    url: String
  }

  type Token {
    access_token: String
  }

  extend type Query {
    token: Token
    tokenByUsername(username: String!): Token
  }

  extend type Mutation {
    createSSOUrl(username: String!, path: String): SSOUrlOutput
  }
`;
