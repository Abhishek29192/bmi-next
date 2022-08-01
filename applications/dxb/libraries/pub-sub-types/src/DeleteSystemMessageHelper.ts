import createDeleteSystemItem from "./DeleteSystemItemHelper";
import { DeleteSystemMessage } from "./types";

export const createDeleteSystemMessage = (
  createDeleteProductMessage?: Partial<DeleteSystemMessage>
): DeleteSystemMessage => ({
  type: "DELETED",
  itemType: "SYSTEMS",
  item: createDeleteSystemItem(),
  ...createDeleteProductMessage
});

export default createDeleteSystemMessage;
