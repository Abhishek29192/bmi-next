import { SysLink } from "../../types";

const createSysLink = <T extends "Asset" | "Entry">(
  sysLink?: Partial<SysLink<T>>
): SysLink<T> => ({
  type: "Link",
  linkType: "Entry" as T,
  id: "asset-type-id",
  ...sysLink
});

export default createSysLink;
