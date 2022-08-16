import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Range Value";

export const up: MigrationFunction = (migration: Migration) => {
  const rangeValue = migration
    .createContentType("rangeValue")
    .name("Range Value")
    .description("");

  rangeValue.createField("start").name("Start").type("Number");

  rangeValue.createField("end").name("End").type("Number");

  rangeValue.createField("value").name("Value").type("Number");

  rangeValue.changeFieldControl("start", "builtin", "numberEditor");
  rangeValue.changeFieldControl("end", "builtin", "numberEditor");
  rangeValue.changeFieldControl("value", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("rangeValue");
