import { Guarantee, RequestStatus } from "@bmi/intouch-api-types";
import { mockGuaranteeType } from "../guaranteeType/data";
import { mockGuaranteedProducts } from "../product/data";
import { mockProject } from "../project/data";
import { emptyNodes, singlePageInfo } from "../utils/graphileNodes";

const mockGuaranteeId = 1;

export const mockGuarantee: Guarantee = {
  id: mockGuaranteeId,
  status: RequestStatus.Approved,
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ==",
  pdf: "http://www.africau.edu/images/default/sample.pdf",
  requestorAccountId: 5,
  responsibleInstallerAccountId: null,
  projectId: 1,
  systemId: null,
  reviewerAccountId: null,
  guaranteeType: mockGuaranteeType,
  project: mockProject,
  startDate: "2020-12-18T12:00:00",
  expiryDate: "2050-12-18T12:00:00",
  evidenceItems: emptyNodes,
  issueNumber: "61715-062",
  guaranteedProducts: {
    nodes: mockGuaranteedProducts,
    edges: [],
    pageInfo: singlePageInfo,
    totalCount: 1
  },
  createdAt: Date.now(),
  updatedAt: Date.now()
};
