import {
  enabledNodeTypes,
  nodes
} from "../variables/richText/20210413104316.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add summary RichText field";

export const up: MigrationFunction = (migration) => {
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

export const down: MigrationFunction = (migration) => {
  migration.editContentType("iframe").deleteField("summary");
};
