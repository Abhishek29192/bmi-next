import { Category, CategoryImage } from "../../types/pim";

const createCategoryImage = (
  categoryImage?: Partial<CategoryImage>
): CategoryImage => ({
  allowedToDownload: true,
  fileSize: 10,
  mime: "image/png",
  name: "name",
  realFileName: "name.png",
  url: "http://categoryImage/name.png",
  ...categoryImage
});

const createCategory = (category?: Partial<Category>): Category => ({
  categoryType: "Category",
  code: "category-code",
  image: createCategoryImage(),
  name: "category-name",
  parentCategoryCode: "category-parent-category-code",
  ...category
});

export default createCategory;
