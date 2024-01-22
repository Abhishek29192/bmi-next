import {
  createProduct as createESProduct,
  Product as ESProduct
} from "@bmi/elasticsearch-types";

export const createProduct = <T extends ESProduct>(data: Partial<T>): T =>
  ({
    ...createESProduct(),
    ...data
  }) as T;
