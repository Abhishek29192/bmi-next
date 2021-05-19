import { Company } from "@bmi/intouch-api-types";
import { mockCompanyAddress } from "../address/data";
import { mockProject } from "../project/data";
import { emptyNodes, singlePageInfo } from "../utils/graphileNodes";

export const mockCompany: Company = {
  id: 2,
  nodeId: "",
  name: "Lehner-Gislason",
  referenceNumber: "64772-300",
  createdAt: "",
  updatedAt: "",
  companyDocuments: emptyNodes,
  companyMembers: emptyNodes,
  addresses: {
    edges: [],
    nodes: [mockCompanyAddress],
    pageInfo: singlePageInfo,
    totalCount: 1
  },
  companyOperationsByCompany: null,
  invitations: null,
  projects: {
    nodes: [mockProject],
    edges: [],
    pageInfo: singlePageInfo,
    totalCount: 1
  }
};
