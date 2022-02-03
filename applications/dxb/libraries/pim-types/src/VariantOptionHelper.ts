import { VariantOption } from "./types";
import createClassification from "./ClassificationHelper";
import createImage from "./ImageHelper";

const createVariantOption = (
  variantOption?: Partial<VariantOption>
): VariantOption => ({
  approvalStatus: "approved",
  classifications: [createClassification({ code: "variant-code" })],
  code: "code",
  externalProductCode: "external-product-code",
  images: [createImage()],
  isSampleOrderAllowed: true,
  longDescription: "<p>Long description</p>",
  shortDescription: "Short description",
  productBenefits: ["product-benefits"],
  ...variantOption
});

export default createVariantOption;
