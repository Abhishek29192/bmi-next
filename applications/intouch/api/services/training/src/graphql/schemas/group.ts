import { gql } from "apollo-server";

export default gql`
  extend type Mutation {
    createGroup(groupCreateInput: GroupCreateInput): GroupCreateResponse
  }

  input RulesList {
    condition_value: String
    condition_type: String
    id_field_common: Int
  }

  input GroupCreateInput {
    name: String
    description: String
    assign_rules: Int
    rules_logic: String
    assign_existing_users: Boolean
    rules_list: [RulesList]
    id_users: [Int]
  }
  type GroupCreateResponse {
    success: Boolean
    id_group: Int
    user_added: Boolean
  }
`;
