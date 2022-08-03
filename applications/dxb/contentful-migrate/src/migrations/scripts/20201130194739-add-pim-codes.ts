import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add PIM Codes to Document Library Page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("pimCodes")
    .name("PIM Codes")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });

  documentLibraryPage.changeFieldControl("pimCodes", "builtin", "tagEditor", {
    helpText:
      "Use product codes to manually select what product documents you want to display. If none are selected, all products will be fetched."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("pimCodes");
};
