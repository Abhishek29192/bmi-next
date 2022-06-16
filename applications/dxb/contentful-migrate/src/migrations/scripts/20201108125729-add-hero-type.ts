import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add heroType field to content type Page";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page
    .createField("heroType")
    .required(true)
    .name("Hero Type")
    .type("Symbol")
    .validations([
      {
        in: ["Hierarchy", "Spotlight"]
      }
    ]);
  page.changeFieldControl("heroType", "builtin", "radio", {
    helpText:
      "Choose Hierarchy if the hero type should be chosen automatically according to the page's menu position."
  });
  page.moveField("heroType").afterField("subtitle");

  migration.transformEntries({
    contentType: "page",
    from: ["heroType"],
    to: ["heroType"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const currentHeroType = (fromFields.heroType || {})[currentLocale];
      return { heroType: currentHeroType || "Hierarchy" };
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.deleteField("heroType");
};
