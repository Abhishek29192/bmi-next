import previousIcons from "../variables/icons/20210120155354.js";
import icons from "../variables/icons/20210324110455.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update to the latest set of brand icons";

export const up: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: icons }]
  });
};

export const down: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
