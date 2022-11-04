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
  // fileStorageId: "guarantee/1/BMI Product Guarantee MP 1.pdf",
  // signedFileStorageUrl:
  //   "https://00f74ba44b62c15329c63328ccef36f50977986573-apidata.googleusercontent.com/download/storage/v1/b/bmi-np-intouch-gcs-privatestorage-euw3-dev/o/guarantee%2F838%2FBMI%20Solution%20Guarantee%20MP%20838.pdf?jk=AFshE3XWX6O0lAJYK_BZRldmC-vTPoMcNJfqs4guWS3X7guV-ciVHaKw4Mep_dX8EUsZ0UV9ZjI1dz59Z0vBsgiSSBijjxrf_LZT4RF7qvd8Ee0NqRReIQTnFWUBIMKKLJDza1GObPVBwq5sj_3H45lDg4jPYa4rOh6yrgslo9DKHvRpBDvp7jHYG1FvixKSw7-NigswEvgMA8rTakfSTkEbcVtW_Sm5fLLrCfvcM01rbF_uEcWwEh1lWB5k7ODFV96lJweXNrj7LAgivQWsUtSbShOyeyQd30rAc0mJbW1SajF5mtf-3I621JQFLpTlj9m7Xv9hNFTMCjqt9pa8e-xGH3AXqgkiq104OFYzCwJDGjmKdazQKtu6sb3UqiPQQaSdXzCgoey3c4cQ4sWjiLjTDT1x7oMliATfucK5Zu3itucGF13q15-_yHDIiLwssSjtrht6wigCNPCSzNA67d8mJawTXfh-wFts8kMxv4jUBMY9RJCtQgdu5OaaISOjWxVx2bOwjE_cfI8dOR3tqxIa9sBbk4ts6PHBXhdq6iQSvk2WmeKr0zRutwLNhoTQ-qD34c346gAbx3k1bZWaaFe5AZCd6-BqzwzCFaXZxlmZgtO77uKzeZoYXW3N8xdV_6wyxtE8Q047p3LRvmLESGKVxtPzgJelc_QDoeSt4HYGc0yZ3MrIJuQNS5h03K20AVLZ3Ru_H1IYhE0c0sr2TWvq3oi7dhmuOeXvA0rWynQXO1ts-YRU7vK1d-nTxAbAd02ysP2-8JWmvo8WRhyjQ_QI3UJP79fodln6K30Yc3ZQTLJu14-9SKDU47w3yXUwB2qAJZNPWAzIBcWpFgghY0oqdVJFs2Ijs8q0Ip7cU4CUPU2hU1GlTFNdFzzNkVqQqAOdYYS6gvQmVFZxUgGdB3qf0stG040f362ztmNz1msbqO2ZIK6bSqI2K1wFGpvy0EkEE0R6e2E29pcWKnBOkmODeEE8lNbfS2j_tfm03QOtbYvfXcV_Qlaob2U5lYDhei2M6H-p_EgQCDkxN4_8oNAyGgvEobu7Xoa6k-CcTZMv9mwWpMxq0-9nQH_Yi9noRjLaB0DgZ-VlfTGEgo3t56EcP453iifihgNOabg6Cajuql5Rdx3oajTOvlYNcSSG2TCwRyyK00srKdkaWkVjPaBM7odnUbm3ndxd6LYlhPpmIlpiGTJfD8ydap17p8o4HEu3P3SdKekLHN1D6DyEzu0UoQLgow-H5bA46r6H2EAyXvPsV4BggbS2Fvj7sPMZe1LYlv4EVtzxdnonD4XnruRPe9idgWStK9vO_z6HbHagnx0C_c3Jv7TnX-_p6PIhrc3-bt2kvlIJH7Ar7lShjqRT8yfG27IwsG7GZ1jeeQ&isca=1"
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
