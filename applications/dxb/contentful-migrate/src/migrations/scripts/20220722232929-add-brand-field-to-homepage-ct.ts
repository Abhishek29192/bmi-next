import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "add brands field to hompepage";

export const up: MigrationFunction = (migration: Migration) => {
  const homePage = migration.editContentType("homePage");
  homePage
    .createField("spaBrands")
    .name("Brands")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["brand"] }],
      linkType: "Entry"
    });

  homePage.changeFieldControl("spaBrands", "builtin", "entryLinksEditor", {
    helpText:
      "If the field is empty then the HomePage will show BrandCards for all the Brand Lading Pages. If the field is populated then the HomePage will show BrandCards related to the respective Brand content added."
  });
  homePage.moveField("spaBrands").afterField("overlapCards");
};

export const down: MigrationFunction = (migration: Migration) => {
  const homePage = migration.editContentType("homePage");
  homePage.deleteField("spaBrands");
};
