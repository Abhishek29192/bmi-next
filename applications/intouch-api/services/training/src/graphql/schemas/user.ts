import { gql } from "apollo-server";

export default gql`
  extend type Query {
    checkUserValidatiy(username: String, email: String): UserValidatiy
  }
  extend type Mutation {
    createUser(userCreateInput: UserCreateInput): UserCreateResponse
  }

  type Branches {
    id: Int
    iLeft: Int
    iRight: Int
  }
  type AdditionalFields {
    id: String
    title: String
    type: String
    mandatory: Boolean
    invisible_to_user: Boolean
    settings: String
    sequence: Int
    enabled: Boolean
  }

  type UserData {
    user_id: String
    username: String
    first_name: String
    last_name: String
    email: String
    uuid: String
    lang_code: String
    force_change: String
    expiration: String
    email_validation_status: String
    valid: String
    avatar: String
    can_manage_subordinates: Boolean
    is_saml_provision: String
    language: String
    level: String
    date_format: String
    timezone: String
    manager_first_name: String
    manager_last_name: String
    manager_username: String
    manager_id: String
    role_id: String
    role_title: String
    role: String
    cant_have_direct_manager: Boolean
    subordinates: [String]
  }

  type UserInfo {
    saml_settings: [String]
    branches: [Branches]
    additional_fields: [AdditionalFields]
    user_data: UserData
  }

  type SSOUrl {
    link: String
  }

  input Manager {
    manager_type_id: Int
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
  type Message {
    id: String
    message: String
  }

  type UserCreateResponse {
    success: Boolean
    user_id: Int
    message: [Message]
  }
  type UserValidatiy {
    success: Boolean
  }
`;
