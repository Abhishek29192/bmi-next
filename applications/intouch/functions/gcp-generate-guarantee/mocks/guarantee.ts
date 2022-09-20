import { Guarantee } from "@bmi/intouch-api-types";
import { mockGuaranteeType, mockSolutionGuaranteeType } from "./guaranteeType";
import { mockProduct } from "./product";
import { mockProject } from "./project";
import { mockSystem } from "./system";
import { emptyNodes } from "./utils/graphileNodes";
import { mockDoubleAcceptance } from "./doubleAcceptance";

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
  updatedAt: Date.now(),
  doubleAcceptances: emptyNodes
};

export const mockSolutionGuarantee: Guarantee = {
  id: 1,
  status: "APPROVED",
  coverage: "SOLUTION",
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ==",
  requestorAccountId: 5,
  projectId: 5,
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
  updatedAt: Date.now(),
  doubleAcceptances: {
    nodes: [mockDoubleAcceptance()],
    ...emptyNodes
  }
  // fileStorageId: "guarantee/1/BMI Product Guarantee MP 1.pdf",
  // signedFileStorageUrl:
  //   "https://storage.googleapis.com/bmi-np-intouch-gcs-privatestorage-euw3-dev/guarantee/5/BMI%20Product%20Guarantee%20MP%205.pdf?GoogleAccessId=sa-intouch-companies-dev%40bmi-np-intouch-compute-dev.iam.gserviceaccount.com&Expires=1662112204&Signature=E3yGrUPi03rvGa6DxcTWte8QMkuQrfLBf1DFBOgg1lCvd7CS4J%2FTx79oXIEyvQTo8nPXMd0caB8uEydjVF7mF6zPIc4qQfL2q%2BhRl2qROUq3%2BI2XU9heM5fdNzt4azVPrtrRL8Tk5lA1xciGQLsslPbUZSJqMQ3AS%2BwhVweWhSrT21vXGlGzMtsJydEffWEyGMSdJIbgq6ciTZUrM1RibY8f6961dUds7QDzyjIL5ksb6%2F3Yf%2Bdw06jLFW9T5hZbuLNjAaJ1EYrMq4IsGNFzOwtv8KErLjRar0enLMhjnHBZ6KN2stTk2ej0LtMerCvMGuPheMLCmgxzllYwoGJdmw%3D%3D"
};
