import { getExtensions } from "@bmi-digital/contentful-migration";

import type { MigrationFunction } from "contentful-migration";

export const description =
  'Install "contentful-tables" plugin on Table Data field';

export const up: MigrationFunction = async (migration, context?) => {
  if (!context) {
    throw new Error("Unable to get extensions");
  }

  const extensions = await getExtensions(context.makeRequest);

  const extension = extensions.items.find(
    ({ extension }) => extension.name === "Contentful Tables"
  );

  if (!extension) {
    throw new Error("Contentful Tables Extension was not found");
  }

  const table = migration.editContentType("table");
  table.changeFieldControl("data", "extension", extension.sys.id);
};

export const down: MigrationFunction = (migration) => {
  const table = migration.editContentType("table");
  table.changeFieldControl("data", "builtin", "object");
};
