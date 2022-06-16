import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands as icons } from "../../variables/icons/20201110150955";

export const description = "Update icons to use avariable file";

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
    validations: [
      {
        in: ["Icopal", "Monier", "Monarplan", "Arrow", "Zanda", "AeroDek"]
      }
    ]
  });
};
