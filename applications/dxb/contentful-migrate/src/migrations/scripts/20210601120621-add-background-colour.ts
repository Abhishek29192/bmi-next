import { backgroundColor } from "../../variables/colours/20210601130010.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add background colour";

export const up: MigrationFunction = (migration) => {
  migration
    .editContentType("promo")
    .createField("backgroundColor")
    .name("Background Colour")
    .type("Symbol")
    .validations([{ in: backgroundColor }]);
};

export const down: MigrationFunction = (migration) => {
  migration.editContentType("promo").deleteField("backgroundColor");
};
