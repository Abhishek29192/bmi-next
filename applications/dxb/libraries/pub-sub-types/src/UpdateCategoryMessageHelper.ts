import { UpdateCategoryMessage } from "./types";

const createUpdateCategoryMessage = (
  updateProductMessage?: Partial<UpdateCategoryMessage>
): UpdateCategoryMessage => ({
  type: "UPDATED",
  itemType: "CATEGORIES",
  item: {},
  ...updateProductMessage
});

export default createUpdateCategoryMessage;
