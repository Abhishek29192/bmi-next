import { createSystem } from "@bmi/pim-types";
import { UpdateSystemMessage } from "./types";

const createUpdateSystemMessage = (
  updateProductMessage?: Partial<UpdateSystemMessage>
): UpdateSystemMessage => ({
  type: "UPDATED",
  itemType: "SYSTEMS",
  item: createSystem(),
  ...updateProductMessage
});

export default createUpdateSystemMessage;
