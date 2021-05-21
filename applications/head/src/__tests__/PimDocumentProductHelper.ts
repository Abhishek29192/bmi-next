import { PIMDocumentProduct } from "../components/types/PIMDocumentBase";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";

const createProduct = (
  product?: Partial<PIMDocumentProduct>
): PIMDocumentProduct => ({
  code: "product-code",
  name: "product-name",
  categories: [createCategory()],
  classifications: [createClassification()],
  ...product
});

export default createProduct;
