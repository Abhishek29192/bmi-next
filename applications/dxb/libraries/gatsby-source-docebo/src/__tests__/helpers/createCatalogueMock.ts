import type { Catalogue, CatalogueSubItem } from "../../types";

export const createCatalogueMock = (
  catalogue: Partial<Catalogue> = {}
): Catalogue => ({
  catalogue_code: "BMI_NO_CAT_01",
  catalogue_description:
    "<p>This is the catalogue description, which can say that these courses are best suited to architects.</p>",
  catalogue_id: 1,
  catalogue_name: "NO General Catalogue",
  catalogue_sort_attr: "item_id",
  catalogue_sort_dir: "desc",
  items_count: 1,
  number_items: 1,
  sub_items: [createCatalogueSubItemMock()],
  ...catalogue
});

export const createCatalogueSubItemMock = (
  catalogSubItem: Partial<CatalogueSubItem> = {}
): CatalogueSubItem => ({
  access_status: 1,
  affiliate_price: "0.00",
  course_type: "elearning",
  duration: "0",
  is_affiliate: false,
  is_new: true,
  is_opened: "1",
  is_user_enrolled: "0",
  is_user_subscribed: 0,
  item_can_enroll: "2",
  item_category: "2",
  item_code: "UK_TEST_X",
  item_description: "<p>UK_TEST_X</p>",
  item_id: "270",
  item_language: "english_uk",
  item_language_code: "en-gb",
  item_language_label: "English UK",
  item_name: "UK_TEST_X",
  item_policy: "1",
  item_price: "0.00",
  item_rating: 0,
  item_rating_option: "only_completed",
  item_slug: "uktestx",
  item_thumbnail: "",
  item_type: "learning_course_type",
  price_status: 1,
  waiting: false,
  item_visibility: "0",
  ...catalogSubItem
});
