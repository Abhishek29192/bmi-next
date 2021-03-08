import { gql } from "apollo-server";

export default gql`
  extend type Query {
    branches: BranchType
  }
  type Branch {
    id: String
    code: String
    title: String
    lev: String
    iLeft: String
    iRight: String
    parent_code: String
    parent_id: String
    selection_status: Int
    selectable: Int
    has_children: Boolean
    can_manage: Boolean
    icon: String
    color: String
    tooltip: String
    actions: [String]
  }

  type BranchData {
    count: Int
    has_more_data: Boolean
    cursor: String
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    items: [Branch]
  }
  type BranchExtraData {
    id: Int
    code: String
    title: String
    id_parent: Int
    title_parent: String
    lev: Int
    iLeft: Int
    iRight: Int
    is_root: Boolean
    root_node_id: Int
  }

  type BranchType {
    extra_data: BranchExtraData
    data: BranchData
  }
`;
