import { GuaranteedProduct, Product, Technology } from "@bmi/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

const mockProductBoilerplate = {
  createdAt: Date.now(),
  updatedAt: Date.now(),
  guaranteedProducts: emptyNodes,
  systemMembers: emptyNodes
};

export const mockProducts: Product[] = [
  {
    id: 1,
    nodeId: "1",
    name: "BMI Braas Otcom Professional-1XL-1",
    technology: Technology.Pitched,
    ...mockProductBoilerplate
  },
  {
    id: 2,
    nodeId: "2",
    name: "BMI Schiedel Asoka Professional-2XL-2",
    technology: Technology.Pitched,
    ...mockProductBoilerplate
  },
  {
    id: 3,
    nodeId: "3",
    name: "BMI Monier Temp Professional-3XL-2",
    technology: Technology.Pitched,
    ...mockProductBoilerplate
  }
];

export const mockGuaranteedProducts: GuaranteedProduct[] = mockProducts.map(
  (product, idx) => ({
    id: idx,
    nodeId: `${idx}`,
    product,
    guaranteeId: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
);
