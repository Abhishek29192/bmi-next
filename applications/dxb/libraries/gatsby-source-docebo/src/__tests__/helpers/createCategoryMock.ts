import type { Category } from "../../types";

export const createCategoryMock = (
  category: Partial<Category> = {}
): Category => ({
  id: 1,
  code: "code",
  title: "title",
  title_parent: "title parent",
  has_child: false,
  lev: 1,
  iLeft: 0,
  iRight: 1,
  icon: "icon",
  ...category
});
