import { Category } from "./types";

const createCategory = (category?: Partial<Category>): Category => ({
  categoryType: "Brand",
  code: "code",
  image: {
    allowedToDownload: true,
    fileSize: 10,
    mime: "image/png",
    name: "name",
    realFileName: "real-file-name.png",
    url: "http://localhost:8000"
  },
  name: "name",
  parentCategoryCode: "parent-category-code",
  ...category
});

export default createCategory;
