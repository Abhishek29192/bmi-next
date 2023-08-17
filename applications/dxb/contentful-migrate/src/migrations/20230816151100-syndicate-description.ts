import type { MigrationFunction } from "contentful-migration";

export const description = 'Enable syndicate section "description" field';

export const up: MigrationFunction = (migration) => {
  const contentType = migration.editContentType("villainSection");
  contentType
    .editField("description")
    .disabled(false)
    .localized(true)
    .omitted(false);
};

export const down: MigrationFunction = (migration) => {
  const contentType = migration.editContentType("villainSection");
  contentType.editField("description").disabled(true).omitted(true);
};
