import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import previousIcons from "../../variables/icons/20201110150955";
import icons from "../../variables/icons/20201111103444";

export const description = "Add Monarflex icon";

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
