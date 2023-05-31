import {
  createProduct as createESProduct,
  Product as ESProduct
} from "@bmi/elasticsearch-types";
import { createSizeLabel } from "../productListerPageUtils";

const productWithVariantAndBase: ESProduct = createESProduct();

describe("productListerPageUtils", () => {
  it("createSizeLabel returns the correct size label", () => {
    const product = {
      ...productWithVariantAndBase,
      MEASUREMENTS$LENGTH: [
        { name: "Length 1", value: "Value 1", code: "Code 1" },
        { name: "Length 2", value: "Value 2", code: "Code 2" }
      ],
      MEASUREMENTS$WIDTH: [
        { name: "Width 1", value: "Value 3", code: "Code 3" },
        { name: "Width 2", value: "Value 4", code: "Code 4" }
      ]
    };

    const sizeLabel = createSizeLabel(product);
    expect(sizeLabel).toBe("Value 1xCode 3 | Value 2xCode 4");
  });
});
