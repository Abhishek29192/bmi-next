import { Category } from "./types";

const createCategory = (category?: Partial<Category>): Category => ({
  code: "category-code",
  parentCategoryCode: "parent-category-code",
  ...category
});

export default createCategory;
