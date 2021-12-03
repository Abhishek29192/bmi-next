import { Product } from "@bmi/intouch-api-types";

const defaultConfig: Product = {
  id: 1,
  marketId: 1,
  nodeId: "1",
  name: "name",
  technology: "PITCHED",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  bmiRef: "",
  brand: "brand",
  family: "family",
  maximumValidityYears: 2,
  published: true,
  systemMembersByProductBmiRef: null,
  guaranteesByProductBmiRef: null
};

export const generateProduct = (config: Partial<Product> = {}): Product => {
  return { ...defaultConfig, ...config };
};
