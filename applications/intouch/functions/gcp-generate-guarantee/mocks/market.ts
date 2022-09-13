import { Market } from "@bmi/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

export const mockMarket: Market = {
  id: 1,
  nodeId: "",
  domain: "en",
  companies: emptyNodes,
  companyMembers: emptyNodes,
  language: "EN",
  systems: emptyNodes,
  accounts: emptyNodes,
  products: emptyNodes,
  systemMembers: emptyNodes,
  createdAt: Date.now(),
  updatedAt: Date.now()
};
