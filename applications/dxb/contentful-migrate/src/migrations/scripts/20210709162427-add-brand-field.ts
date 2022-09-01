import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands } from "../../variables/icons/20210512134828";

export const description = "Add brandLogo field to team page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("teamPage");

  page
    .createField("brandLogo")
    .name("Brand")
    .type("Symbol")
    .validations([{ in: brands }]);

  page.moveField("brandLogo").afterField("featuredImage");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("teamPage");

  page.deleteField("brandLogo");
};
