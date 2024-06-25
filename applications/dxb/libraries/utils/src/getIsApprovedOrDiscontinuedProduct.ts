import { ApprovalStatus } from "@bmi/pim-types";
import type { Product, VariantOption } from "@bmi/pim-types";

type ApprovalOrDiscontinuedProduct<T> = T & {
  approvalStatus: ApprovalStatus.Approved | ApprovalStatus.Discontinued;
};

export const getIsApprovedOrDiscontinuedProduct = <
  T extends Product | VariantOption
>(
  product: T
): product is ApprovalOrDiscontinuedProduct<T> => {
  return (
    product.approvalStatus === ApprovalStatus.Approved ||
    product.approvalStatus === ApprovalStatus.Discontinued
  );
};
