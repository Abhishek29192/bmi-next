import { gql } from "graphile-utils";

export default gql`
  type SSOUrlOutput {
    url: String
  }

  type Token {
    access_token: String
  }

  input SelectOrgchart {
    branch_id: String
  }
  input UserCreateInput {
    userid: String
    email: String
    password: String
    privacy: String
    firstname: String
    lastname: String
    force_change: Int
    level: Int
    language: String
    expiration: String
    email_validation_status: Int
    valid: Int
    date_format: String
    timezone: String
    role: Int
    send_notification_email: Boolean
    can_manage_subordinates: Boolean
    select_orgchart: SelectOrgchart
  }
  type UserCreateResponse {
    success: Boolean
    user_id: Int
  }

  extend type Query {
    token: Token
    tokenByUsername(username: String!): Token
  }

  extend type Mutation {
    createSSOUrl(username: String!, path: String): SSOUrlOutput
    updateTraining(lastUpdateDate: String): String
    createDoceboUser(input: UserCreateInput): UserCreateResponse
  }
`;
