import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import previousIcons from "../../variables/icons/20210324110455";
import icons from "../../variables/icons/20210512134828";

export const description = "Update to the latest set of brand icons";

export const up: MigrationFunction = (migration: Migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: icons }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
