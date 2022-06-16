import { getAllContentTypes } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "localise all content type fields";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const allContentTypes = await getAllContentTypes(context!.makeRequest);
  allContentTypes.items
    .filter((ctype: any) => ctype.sys.id !== "migration")
    .forEach((ct: any) => {
      const migrationContentType = migration.editContentType(ct.sys.id);
      ct.fields.forEach((field: any) => {
        if (!field.localized) {
          migrationContentType.editField(field.id).localized(true);
        }
      });
    });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  // Below are the content type fields which had localisation set to true
  // when this migration is created. Technically this not a 100% reversal.
  // But this is good enough for dev purposes. Production roll back can/should
  // use backups instead.
  const exclude = {
    form: ["title", "description", "submitText"],
    sampleBasket: [
      "title",
      "description",
      "emptyBasketMessage",
      "browseProductsCTALabel"
    ]
  };
  const allContentTypes = await getAllContentTypes(context!.makeRequest);
  allContentTypes.items
    .filter((ctype: any) => ctype.sys.id !== "migration")
    .forEach((ct: any) => {
      const migrationContentType = migration.editContentType(ct.sys.id);
      ct.fields.forEach((field: any) => {
        if (
          field.localized &&
          !exclude[ct.sys.id as "form" | "sampleBasket"]?.includes(field.id)
        ) {
          migrationContentType.editField(field.id).localized(false);
        } else {
          console.log(`Skip Content type: ${ct.sys.id} -> Field ${field.id}`);
        }
      });
    });
};
