import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add document display format on resources";

const field = "documentDisplayFormat";
const contentType = "resources";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType(contentType);
  resources
    .createField(field)
    .name("Document display format")
    .type("Symbol")
    .validations([{ in: ["Asset type", "Asset name"] }])
    .required(true);

  migration.transformEntries({
    contentType,
    from: [],
    to: [field],
    transformEntryForLocale: async () => ({
      documentDisplayFormat: "Asset type"
    })
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType(contentType);
  resources.deleteField(field);
};
