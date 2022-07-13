import { DeleteSystemItem, ObjType } from "./types";

const createDeleteSystemItem = (
  deleteItemType?: Partial<DeleteSystemItem>
): DeleteSystemItem => ({
  code: "code",
  objType: ObjType.System,
  ...deleteItemType
});

export default createDeleteSystemItem;
