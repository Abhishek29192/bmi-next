import {
  ApprovalStatus,
  createProduct,
  createVariantOption
} from "@bmi/pim-types";
import { getIsApprovedOrDiscontinuedProduct } from "../getIsApprovedOrDiscontinuedProduct";

describe("getIsApprovedOrDiscontinuedProduct", () => {
  describe("Base product", () => {
    it("returns false if approvalStatus is unapproved", () => {
      const product = createProduct({
        approvalStatus: ApprovalStatus.Unapproved
      });
      expect(getIsApprovedOrDiscontinuedProduct(product)).toBeFalsy();
    });

    it("returns false if approvalStatus is check", () => {
      const product = createProduct({
        approvalStatus: ApprovalStatus.Check
      });
      expect(getIsApprovedOrDiscontinuedProduct(product)).toBeFalsy();
    });

    it("returns false if approvalStatus is preview", () => {
      const product = createProduct({
        approvalStatus: ApprovalStatus.Preview
      });
      expect(getIsApprovedOrDiscontinuedProduct(product)).toBeFalsy();
    });

    it("returns true if approvalStatus is approved", () => {
      const product = createProduct({
        approvalStatus: ApprovalStatus.Approved
      });
      expect(getIsApprovedOrDiscontinuedProduct(product)).toBeTruthy();
    });

    it("returns true if approvalStatus is discontinued", () => {
      const product = createProduct({
        approvalStatus: ApprovalStatus.Discontinued
      });
      expect(getIsApprovedOrDiscontinuedProduct(product)).toBeTruthy();
    });
  });

  describe("Variant product", () => {
    it("returns false if approvalStatus is unapproved", () => {
      const variantOption = createVariantOption({
        approvalStatus: ApprovalStatus.Unapproved
      });
      expect(getIsApprovedOrDiscontinuedProduct(variantOption)).toBeFalsy();
    });

    it("returns false if approvalStatus is check", () => {
      const variantOption = createVariantOption({
        approvalStatus: ApprovalStatus.Check
      });
      expect(getIsApprovedOrDiscontinuedProduct(variantOption)).toBeFalsy();
    });

    it("returns false if approvalStatus is preview", () => {
      const variantOption = createVariantOption({
        approvalStatus: ApprovalStatus.Preview
      });
      expect(getIsApprovedOrDiscontinuedProduct(variantOption)).toBeFalsy();
    });

    it("returns true if approvalStatus is approved", () => {
      const variantOption = createVariantOption({
        approvalStatus: ApprovalStatus.Approved
      });
      expect(getIsApprovedOrDiscontinuedProduct(variantOption)).toBeTruthy();
    });

    it("returns true if approvalStatus is discontinued", () => {
      const variantOption = createVariantOption({
        approvalStatus: ApprovalStatus.Discontinued
      });
      expect(getIsApprovedOrDiscontinuedProduct(variantOption)).toBeTruthy();
    });
  });
});
