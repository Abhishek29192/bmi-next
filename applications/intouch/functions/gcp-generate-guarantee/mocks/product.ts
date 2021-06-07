import { Product } from "@bmi/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

export const mockProduct: Product = {
  id: 1,
  nodeId: "1",
  name: "BMI Braas Otcom Professional-1XL-1",
  technology: "PITCHED",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  systemMembersByProductBmiRef: emptyNodes,
  guaranteesByProductBmiRef: emptyNodes
};
