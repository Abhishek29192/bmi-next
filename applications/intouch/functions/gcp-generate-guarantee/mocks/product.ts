import { Product } from "@bmi-digital/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

export const mockProduct: Product = {
  id: 1,
  marketId: 1,
  nodeId: "1",
  name: "BMI Braas Otcom Professional-1XL-1",
  technology: "PITCHED",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  bmiRef: "",
  brand: "",
  family: "",
  maximumValidityYears: 2,
  published: true,
  systemMembersByProductBmiRef: emptyNodes,
  guaranteesByProductBmiRef: emptyNodes
};
