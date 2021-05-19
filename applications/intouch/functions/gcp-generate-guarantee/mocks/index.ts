import { base64_encode } from "../src/util/imageUtil";
import { mockGuarantee } from "./guarantee/data";

export const getGuarantee = async () => {
  mockGuarantee.guaranteeType.signature.image = await base64_encode(
    mockGuarantee.guaranteeType.signature.url
  );

  for (const template of mockGuarantee.guaranteeType
    .guaranteeTemplatesCollection.items) {
    template.logo.image = await base64_encode(template.logo.url);
  }
  return mockGuarantee;
};
