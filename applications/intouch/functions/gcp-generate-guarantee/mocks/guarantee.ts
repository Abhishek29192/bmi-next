import { Guarantee } from "@bmi/intouch-api-types";
import { mockGuaranteeType, mockSolutionGuaranteeType } from "./guaranteeType";
import { mockProduct } from "./product";
import { mockProject } from "./project";
import { mockSystem } from "./system";
import { emptyNodes } from "./utils/graphileNodes";

export const mockGuarantee: Guarantee = {
  id: 1,
  status: "APPROVED",
  coverage: "PRODUCT",
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ==",
  requestorAccountId: 5,
  projectId: 1,
  systemBmiRef: null,
  reviewerAccountId: null,
  guaranteeReferenceCode: null,
  guaranteeType: mockGuaranteeType,
  project: mockProject,
  startDate: "2020-12-18T12:00:00",
  expiryDate: "2050-12-18T12:00:00",
  evidenceItems: emptyNodes,
  bmiReferenceId: "61715-062",
  languageCode: "EN",
  productByProductBmiRef: mockProduct,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const mockSolutionGuarantee: Guarantee = {
  id: 1,
  status: "APPROVED",
  coverage: "SOLUTION",
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ==",
  requestorAccountId: 5,
  projectId: 1,
  systemBmiRef: null,
  reviewerAccountId: null,
  guaranteeReferenceCode: null,
  guaranteeType: mockSolutionGuaranteeType,
  project: mockProject,
  startDate: "2020-12-18T12:00:00",
  expiryDate: "2050-12-18T12:00:00",
  evidenceItems: emptyNodes,
  bmiReferenceId: "61715-062",
  languageCode: "EN",
  systemBySystemBmiRef: mockSystem,
  createdAt: Date.now(),
  updatedAt: Date.now()
};
