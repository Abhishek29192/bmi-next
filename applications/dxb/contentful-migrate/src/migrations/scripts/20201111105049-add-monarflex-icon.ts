import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands as previousIcons } from "../../variables/icons/20201110150955";
import { brands as icons } from "../../variables/icons/20201111103444";

export const description = "Add Monarflex icon";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: icons }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
