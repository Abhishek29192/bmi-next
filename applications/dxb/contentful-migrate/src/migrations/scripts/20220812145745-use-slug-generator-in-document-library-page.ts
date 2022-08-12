import { getExtensions } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Change slug control from default to Slug Generator";

export const up: MigrationFunction = async (migration: Migration, context) => {
  const extensions = await getExtensions(context!.makeRequest);

  const slugGenerator = extensions.items.find(
    (item) => item.extension.name === "Slug Generator"
  );

  if (slugGenerator) {
    const documentLibraryPage = migration.editContentType(
      "documentLibraryPage"
    );
    documentLibraryPage.changeFieldControl(
      "slug",
      "builtin",
      slugGenerator.sys.id
    );
  }
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.resetFieldControl("slug");
};
