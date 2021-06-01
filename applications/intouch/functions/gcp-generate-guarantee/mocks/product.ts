import { Product, Technology } from "@bmi/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

export const mockProduct: Product = {
  id: 1,
  nodeId: "1",
  name: "BMI Braas Otcom Professional-1XL-1",
  technology: Technology.Pitched,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  guaranteesByProductBmiRef: emptyNodes
};
