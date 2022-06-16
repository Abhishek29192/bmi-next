import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import {
  enabledNodeTypes,
  nodes
} from "../../variables/richText/20210413104316";

export const description = "Create video section";

export const up: MigrationFunction = (migration: Migration) => {
  const videoSection = migration
    .createContentType("videoSection")
    .name("Video Section")
    .displayField("name")
    .description("");

  videoSection.createField("name").name("Name").type("Symbol").required(true);

  videoSection.createField("title").name("Title").type("Symbol");

  videoSection
    .createField("description")
    .name("Description")
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

  videoSection
    .createField("video")
    .name("Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  videoSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "This field won't appear on the website, but it gets used to represent this entry"
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("videoSection");
