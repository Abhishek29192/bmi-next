import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import {
  enabledNodeTypes,
  nodes
} from "../../variables/richText/20210413104316";

export const description = "Add summary RichText field";

export const up: MigrationFunction = (migration: Migration) => {
  const iframe = migration.editContentType("iframe");

  iframe
    .createField("summary")
    .name("Summary")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes,
        message: `Only the following nodes are allowed: ${enabledNodeTypes.join(
          ", "
        )}`
      },
      {
        nodes
      }
    ]);

  iframe.moveField("summary").afterField("title");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("iframe").deleteField("summary");
};
