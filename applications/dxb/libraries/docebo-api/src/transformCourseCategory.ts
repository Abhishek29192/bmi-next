import type { CategoryType, CourseCategory } from "@bmi/docebo-types";

const allowedCategories = ["Pitched", "Flat"];

const isAllowed = (categoryName: string): categoryName is CategoryType => {
  return allowedCategories.includes(categoryName);
};

export const transformCourseCategory = (
  category: CourseCategory
): CategoryType => {
  if (isAllowed(category.name)) {
    return category.name;
  }
  return "Other";
};
