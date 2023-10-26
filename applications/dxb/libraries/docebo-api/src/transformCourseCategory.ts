import { CourseCategory } from "@bmi/docebo-types";

const allowedCategories = ["PITCHED", "FLAT"];

export const transformCourseCategory = (category: CourseCategory): string => {
  if (!allowedCategories.includes(category.name.toUpperCase())) {
    return "Other";
  }

  return category.name;
};
