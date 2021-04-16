import { Category } from "../templates/product-details-page";

const createCategory = (category?: Partial<Category>): Category => ({
  name: "category-name",
  categoryType: "category-category-type",
  code: "category-code",
  parentCategoryCode: "category-parent-category-code",
  ...category
});

export default createCategory;
