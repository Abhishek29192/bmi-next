import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { backgroundColor } from "../../variables/colours/20210601130010";

export const description = "Add background colour";

export const up: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("promo")
    .createField("backgroundColor")
    .name("Background Colour")
    .type("Symbol")
    .validations([{ in: backgroundColor }]);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("promo").deleteField("backgroundColor");
};
