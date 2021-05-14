import { Category } from "../components/ProductBaseTypes";

const createCategory = (category?: Partial<Category>): Category => ({
  name: "category-name",
  categoryType: "category-category-type",
  code: "category-code",
  parentCategoryCode: "category-parent-category-code",
  ...category
});

export default createCategory;
