import { Guarantee } from "@bmi/intouch-api-types";
import { mockGuaranteeType } from "./guaranteeType";
import { mockProduct } from "./product";
import { mockProject } from "./project";
import { emptyNodes } from "./utils/graphileNodes";

export const mockGuarantee: Guarantee = {
  id: 1,
  status: "APPROVED",
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ==",
  requestorAccountId: 5,
  projectId: 1,
  systemBmiRef: null,
  reviewerAccountId: null,
  guaranteeReferenceCode: "PITCHED_PRODUCT",
  guaranteeType: mockGuaranteeType,
  project: mockProject,
  startDate: "2020-12-18T12:00:00",
  expiryDate: "2050-12-18T12:00:00",
  evidenceItems: emptyNodes,
  bmiReferenceId: "61715-062",
  productByProductBmiRef: mockProduct,
  createdAt: Date.now(),
  updatedAt: Date.now()
};
