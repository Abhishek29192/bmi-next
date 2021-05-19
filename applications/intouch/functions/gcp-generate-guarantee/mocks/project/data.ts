import { Project } from "@bmi/intouch-api-types";
import { mockSiteAddress } from "../address/data";
import { emptyNodes, singlePageInfo } from "../utils/graphileNodes";

export const mockProject: Project = {
  id: 2,
  nodeId: "",
  name: "Lehner-Gislason",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  guarantees: emptyNodes,
  projectMembers: emptyNodes,
  notes: emptyNodes,
  addresses: {
    edges: [],
    nodes: [mockSiteAddress],
    pageInfo: singlePageInfo,
    totalCount: 1
  }
};
