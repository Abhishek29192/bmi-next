import { createProduct } from "@bmi/pim-types";
import { UpdateProductMessage } from "./types";

const createUpdateProductMessage = (
  updateProductMessage?: Partial<UpdateProductMessage>
): UpdateProductMessage => ({
  type: "UPDATED",
  itemType: "PRODUCTS",
  item: createProduct(),
  ...updateProductMessage
});

export default createUpdateProductMessage;
