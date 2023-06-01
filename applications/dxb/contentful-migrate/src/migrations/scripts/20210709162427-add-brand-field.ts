import { brands } from "../../variables/icons/20210512134828.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add brandLogo field to team page content type";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("teamPage");

  page
    .createField("brandLogo")
    .name("Brand")
    .type("Symbol")
    .validations([{ in: brands }]);

  page.moveField("brandLogo").afterField("featuredImage");
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("teamPage");

  page.deleteField("brandLogo");
};
