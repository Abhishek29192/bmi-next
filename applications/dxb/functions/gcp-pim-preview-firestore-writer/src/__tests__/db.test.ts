import { transformProduct } from "@bmi/pim-transformation";
import {
  ApprovalStatus,
  createFullyPopulatedProduct,
  createVariantOption
} from "@bmi/pim-types";
import { setItemsInFirestore } from "../db";

const batchSetMock = jest.fn();
const batchCommitMock = jest.fn();
const getDocMock = jest.fn();

jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: jest.fn().mockReturnValue({
    batch: () => ({
      set: batchSetMock,
      commit: batchCommitMock
    }),
    doc: (...args: unknown[]) => getDocMock(...args)
  })
}));

describe("setItemsInFirestore", () => {
  it("writes data in firestore", async () => {
    const origin = process.env.FIRESTORE_ROOT_COLLECTION;
    process.env.FIRESTORE_ROOT_COLLECTION = "preview-products-collection";
    const variantProduct = createVariantOption({
      code: "preview-product-variant"
    });

    const product = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [variantProduct]
    });
    const transformedProducts = transformProduct(product, true);

    await setItemsInFirestore(transformedProducts);
    expect(getDocMock).toHaveBeenCalledWith(
      `preview-products-collection/${transformedProducts[0].code}`
    );
    expect(batchSetMock).toHaveBeenCalledWith(
      getDocMock(),
      transformedProducts[0]
    );
    expect(batchCommitMock).toHaveBeenCalled();
    process.env.FIRESTORE_ROOT_COLLECTION = origin;
  });
});
