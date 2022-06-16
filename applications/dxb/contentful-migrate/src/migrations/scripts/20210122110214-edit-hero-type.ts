import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add levels 1-3 to heroType validation on page content type.";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.editField("heroType").validations([
    {
      in: ["Hierarchy", "Spotlight", "Level 1", "Level 2", "Level 3"]
    }
  ]);
  page.changeFieldControl("heroType", "builtin", "dropdown");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.editField("heroType").validations([
    {
      in: ["Hierarchy", "Spotlight"]
    }
  ]);
  page.changeFieldControl("heroType", "builtin", "radio");
};
