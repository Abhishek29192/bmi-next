import { System } from "@bmi/intouch-api-types";
import { mockSystemMembers } from "./systemMembers";
import { emptyNodes } from "./utils/graphileNodes";

export const mockSystem: System = {
  id: 1,
  marketId: 1,
  nodeId: "1",
  name: "AeroDek Quadro Plus + Icopal Super D",
  technology: "PITCHED",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  bmiRef: "",
  maximumValidityYears: 2,
  published: true,
  guaranteesBySystemBmiRef: emptyNodes,
  systemMembersBySystemBmiRef: {
    edges: null,
    pageInfo: null,
    totalCount: 2,
    nodes: mockSystemMembers
  }
};
