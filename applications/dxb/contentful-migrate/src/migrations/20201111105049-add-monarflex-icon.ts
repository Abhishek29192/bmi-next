import { brands as previousIcons } from "../variables/icons/20201110150955.js";
import { brands as icons } from "../variables/icons/20201111103444.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Monarflex icon";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: icons }]
  });
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
