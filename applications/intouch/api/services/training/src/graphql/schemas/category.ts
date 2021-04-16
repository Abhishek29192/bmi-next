import { gql } from "apollo-server";

export default gql`
  extend type Query {
    categories(options: PageQueryOptions): CategoryType
  }

  type CategoryExtraData {
    id: Int
    title: String
    title_parent: String
    id_parent: Int
    lev: Int
    iLeft: Int
    iRight: Int
    is_root: Boolean
    root_node_id: Int
  }

  type Category {
    id: Int
    title: String
    title_parent: String
    has_child: Int
    lev: Int
    iLeft: Int
    iRight: Int
    icon: String
  }

  type CategoryData {
    count: Int
    has_more_data: Boolean
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    sort: [Sort]
    items: [Category]
  }

  type CategoryType {
    extra_data: CategoryExtraData
    data: CategoryData
  }
`;
