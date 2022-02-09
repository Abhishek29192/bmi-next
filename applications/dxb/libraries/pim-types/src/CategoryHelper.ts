import { Category, CategoryImage } from "./types";

export const createCategoryImage = (
  categoryImage?: Partial<CategoryImage>
): CategoryImage => ({
  allowedToDownload: true,
  fileSize: 10,
  mime: "image/png",
  name: "name",
  realFileName: "real-file-name.png",
  url: "http://localhost:8000",
  ...categoryImage
});

const createCategory = (category?: Partial<Category>): Category => ({
  categoryType: "Category",
  code: "code",
  image: createCategoryImage(),
  name: "name",
  parentCategoryCode: "parent-category-code",
  ...category
});

export default createCategory;
