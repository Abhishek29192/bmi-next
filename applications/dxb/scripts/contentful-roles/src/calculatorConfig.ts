import type { RolePolicy } from "./types";

export const calculatorConfig: RolePolicy = {
  effect: "deny",
  constraint: {
    and: [
      { equals: [{ doc: "sys.type" }, "Entry"] },
      {
        equals: [{ doc: "sys.contentType.sys.id" }, "calculatorRoofShape"]
      }
    ]
  },
  actions: [
    "create",
    "archive",
    "unarchive",
    "update",
    "delete",
    "publish",
    "unpublish"
  ]
};
