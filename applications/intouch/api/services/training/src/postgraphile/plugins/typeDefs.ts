import { gql } from "graphile-utils";

export default gql`
  type SSOUrlOutput {
    url: String
  }

  type Token {
    access_token: String
  }

  type CheckUserValidityPayload {
    success: String
  }

  type UserData {
    user_id: String
    username: String
    first_name: String
    last_name: String
    email: String
    uuid: String
    lang_code: String
    expiration: String
    email_validation_status: String
    valid: String
    language: String
    level: String
    role_id: String
    role_title: String
    role: String
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
    userByEmail(email: String): UserData
    checkUserValidatiy(
      email: String
      username: String
    ): CheckUserValidityPayload
  }

  extend type Mutation {
    createSSOUrl(username: String!, path: String): SSOUrlOutput
    updateTraining(lastUpdateDate: String): String
    createDoceboUser(input: UserCreateInput): UserCreateResponse
  }
`;
