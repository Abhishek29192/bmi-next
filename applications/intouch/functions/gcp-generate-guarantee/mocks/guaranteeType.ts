import {
  ContentfulGuaranteeCoverageType,
  ContentfulGuaranteeType,
  ContentfulTechnologyType
} from "@bmi/intouch-api-types";
import {
  mockTemplateEnglish,
  mockTemplateEsperanto
} from "./guaranteeTemplate";
import { mockContentfulAsset, mockContentfulEntry } from "./utils/contentful";

export const mockGuaranteeType: ContentfulGuaranteeType = {
  ...mockContentfulEntry({ id: "7uSy0NeVTgPiJbOiVYW4DX" }),
  name: "Product guarantee (flat)",
  displayName: "Product guarantee",
  technology: ContentfulTechnologyType["FLAT"],
  coverage: ContentfulGuaranteeCoverageType["PRODUCT"],

  signature: mockContentfulAsset({
    id: "5yryu89fGozf04U3duLJkT",
    fileName: "flat-roof-signature.png",
    url: "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png"
  }),
  guaranteeTemplatesCollection: {
    items: [mockTemplateEnglish, mockTemplateEsperanto]
  }
};
