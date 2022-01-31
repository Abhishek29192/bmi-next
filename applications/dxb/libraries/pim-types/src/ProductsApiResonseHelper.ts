import { ProductsApiResponse } from "./types";
import createProduct from "./ProductHelper";

const createProductsApiResponse = (
  productsApiResponse?: Partial<ProductsApiResponse>
): ProductsApiResponse => ({
  catalog: process.env.PIM_CATALOG_NAME || "",
  currentPage: 0,
  totalPageCount: 1,
  totalProductCount: 1,
  products: [createProduct()],
  version: "Online",
  ...productsApiResponse
});

export default createProductsApiResponse;
