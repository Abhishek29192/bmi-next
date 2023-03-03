import previousIcons from "../../variables/icons/20201111103444";
import icons from "../../variables/icons/20210120155354";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add PhoneMobile icon";

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
