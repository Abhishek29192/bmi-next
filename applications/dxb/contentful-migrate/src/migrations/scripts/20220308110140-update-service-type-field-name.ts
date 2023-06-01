import type { MigrationFunction } from "contentful-migration";

export const description = "Change Service Types field name";

export const up: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("serviceTypes").name("Services Types");
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const down: MigrationFunction = () => {};
