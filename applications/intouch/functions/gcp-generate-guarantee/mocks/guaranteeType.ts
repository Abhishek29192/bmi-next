import { ContentfulGuaranteeType } from "@bmi/intouch-api-types";
import {
  mockTemplateEnglish,
  mockTemplateEsperanto
} from "./guaranteeTemplate";
import { mockContentfulAsset } from "./utils/contentful";

export const mockGuaranteeType: ContentfulGuaranteeType = {
  sys: null,
  name: "Product guarantee (flat)",
  displayName: "Product guarantee",
  technology: "FLAT",
  coverage: "PRODUCT",
  signature: mockContentfulAsset({
    id: "5yryu89fGozf04U3duLJkT",
    fileName: "flat-roof-signature.png",
    url: "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png"
  }),
  guaranteeTemplatesCollection: {
    total: 2,
    items: [mockTemplateEnglish, mockTemplateEsperanto]
  }
};
export const mockSolutionGuaranteeType: ContentfulGuaranteeType = {
  sys: null,
  name: "Solution guarantee (flat)",
  displayName: "Solution guarantee",
  technology: "FLAT",
  coverage: "SOLUTION",
  signature: mockContentfulAsset({
    id: "5yryu89fGozf04U3duLJkT",
    fileName: "flat-roof-signature.png",
    url: "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png"
  }),
  guaranteeTemplatesCollection: {
    total: 2,
    items: [mockTemplateEnglish, mockTemplateEsperanto]
  }
};
