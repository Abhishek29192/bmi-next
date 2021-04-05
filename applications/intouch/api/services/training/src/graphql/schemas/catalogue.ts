import { gql } from "apollo-server";

export default gql`
  extend type Query {
    catalogues(options: PageQueryOptions): CatalogueData
  }

  type CatalogueSubItem {
    item_id: Int
    item_type: String
    item_code: String
    item_name: String
    item_slug: String
    item_description: String
    item_category: Int
    item_language: String
    item_language_label: String
    item_thumbnail: String
    number_of_courses: Int
    item_price: Int
    item_rating_option: String
    item_rating: Int
    is_new: Int
    item_visibility: Int
    item_policy: Int
    item_can_enroll: Int
    is_opened: Int
    access_status: Int
    price_status: Int
    shopify_product_meaningful_id: String
    id_partner: Int
    affiliate_price: Int
    is_affiliate: Boolean
    can_enter: Boolean
    can_enter_reason: String
    expiration_date: String
  }

  type Catalogue {
    catalogue_id: Int
    catalogue_name: String
    catalogue_description: String
    catalogue_code: String
    catalogue_sort_attr: String
    catalogue_sort_dir: String
    number_items: Int
    items_count: Int
    sub_items: [CatalogueSubItem]
  }

  type CatalogueData {
    count: Int
    cursor: String
    has_more_data: Boolean
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    sort: [Sort]
    items: [Catalogue]
  }
`;
