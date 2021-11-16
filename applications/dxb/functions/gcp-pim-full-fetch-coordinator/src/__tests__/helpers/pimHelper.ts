import { ProductsApiResponse, SystemsApiResponse } from "../../pim";

export const createProductsApiResponse = (
  productsApiResponse?: Partial<ProductsApiResponse>
): ProductsApiResponse => ({
  catalog: process.env.PIM_CATALOG_NAME,
  currentPage: 0,
  totalPageCount: 1,
  totalProductCount: 1,
  products: [{}],
  version: "Online",
  ...productsApiResponse
});

export const createSystemsApiResponse = (
  systemsApiResponse?: Partial<SystemsApiResponse>
): SystemsApiResponse => ({
  catalog: process.env.PIM_CATALOG_NAME,
  currentPage: 0,
  totalPageCount: 1,
  totalProductCount: 1,
  systems: [{}],
  ...systemsApiResponse
});
