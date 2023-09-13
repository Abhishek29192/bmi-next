import type { Sort } from "./sort";

export type Catalogue = {
  catalogue_id: number;
  catalogue_name: string;
  catalogue_description: string;
  catalogue_code: string;
  catalogue_sort_attr: string;
  catalogue_sort_dir: string;
  number_items: number;
  items_count: number;
  sub_items: CatalogueSubItem[];
};

export type CatalogueSubItem = {
  item_id: string;
  item_type: string;
  item_code: string;
  item_name: string;
  item_slug: string;
  item_description: string;
  item_category: string;
  item_language: string;
  item_language_label: string;
  item_thumbnail: string;
  item_price: string;
  item_rating_option: string;
  item_rating: number;
  is_new: boolean;
  item_visibility: string;
  item_policy: string;
  item_can_enroll: string;
  is_opened: string;
  access_status: number;
  price_status: number;
  affiliate_price: string;
  is_affiliate: boolean;
  course_type: string;
  duration: string;
  is_user_enrolled: string;
  is_user_subscribed: number;
  item_language_code: string;
  waiting: boolean;
};

export type CatalogueData = {
  count: number;
  cursor: string;
  has_more_data: boolean;
  current_page: number;
  current_page_size: number;
  total_page_count: number;
  total_count: number;
  sort: Sort[];
  items: Catalogue[];
};
