import { getExtensions } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "update table contentful extension";

export const up: MigrationFunction = async (migration, context) => {
  const table = migration.editContentType("table");
  const extensions = await getExtensions(context!.makeRequest);

  if (extensions && extensions.items) {
    const tableEditorExtension = extensions.items.find(
      (item) => item.extension.name === "table field editor"
    );
    if (tableEditorExtension) {
      table.changeFieldControl(
        "data",
        "extension",
        tableEditorExtension.sys.id
      );
    }
  }
};

export const down: MigrationFunction = (migration) => {
  const table = migration.editContentType("table");
  table.changeFieldControl("data", "extension", "7zdNJV7cj8MpVwN5ontGk2");
};
