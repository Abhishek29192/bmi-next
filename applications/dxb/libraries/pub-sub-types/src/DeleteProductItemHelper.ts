import { DeleteProductItem, ObjType } from "./types";

const createDeleteProductItem = (
  deleteItemType?: Partial<DeleteProductItem>
): DeleteProductItem => ({
  code: "code",
  objType: ObjType.Base_product,
  ...deleteItemType
});

export default createDeleteProductItem;
