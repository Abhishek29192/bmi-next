import createDeleteProductItem from "./DeleteProductItemHelper";
import { DeleteProductMessage } from "./types";

export const createDeleteProductMessage = (
  createDeleteProductMessage?: Partial<DeleteProductMessage>
): DeleteProductMessage => ({
  type: "DELETED",
  itemType: "PRODUCTS",
  item: createDeleteProductItem(),
  ...createDeleteProductMessage
});

export default createDeleteProductMessage;
