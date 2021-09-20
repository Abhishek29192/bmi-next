import { Company } from "@bmi-digital/intouch-api-types";
import { mockCompanyAddress } from "./address";
import { mockProject } from "./project";
import { emptyNodes, singlePageInfo } from "./utils/graphileNodes";

export const mockCompany: Company = {
  id: 2,
  nodeId: "",
  name: "Lehner-Gislason",
  referenceNumber: "64772300",
  createdAt: "",
  updatedAt: "",
  companyDocuments: emptyNodes,
  companyMembers: emptyNodes,
  tradingAddress: mockCompanyAddress,
  registeredAddress: mockCompanyAddress,
  companyOperationsByCompany: null,
  invitations: null,
  projects: {
    nodes: [mockProject],
    edges: [],
    pageInfo: singlePageInfo,
    totalCount: 1
  }
};
