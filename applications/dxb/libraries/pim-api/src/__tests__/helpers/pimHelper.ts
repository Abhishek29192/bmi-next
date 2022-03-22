import {
  createProduct,
  createSystem,
  ProductsApiResponse,
  SystemsApiResponse
} from "@bmi/pim-types";

export const createProductsApiResponse = (
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

export const createSystemsApiResponse = (
  systemsApiResponse?: Partial<SystemsApiResponse>
): SystemsApiResponse => ({
  catalog: process.env.PIM_CATALOG_NAME || "",
  currentPage: 0,
  totalPageCount: 1,
  totalSystemsCount: 1,
  systems: [createSystem()],
  ...systemsApiResponse
});
