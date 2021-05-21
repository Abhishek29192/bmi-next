import { Project } from "@bmi/intouch-api-types";
import { mockSiteAddress } from "./address";
import { mockCompany } from "./company";
import { emptyNodes, singlePageInfo } from "./utils/graphileNodes";

export const mockProject: Project = {
  id: 2,
  nodeId: "",
  name: "Lehner-Gislason",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  company: mockCompany,
  guarantees: emptyNodes,
  projectMembers: emptyNodes,
  notes: emptyNodes,
  buildingOwnerFirstname: "Herion",
  buildingOwnerLastname: "Buildmaster",
  buildingOwnerMail: "owner@building.com",
  roofArea: 50,
  addresses: {
    edges: [],
    nodes: [mockSiteAddress],
    pageInfo: singlePageInfo,
    totalCount: 1
  }
};
