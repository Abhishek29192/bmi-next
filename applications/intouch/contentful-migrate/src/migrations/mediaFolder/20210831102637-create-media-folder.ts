import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Media Folder";

export const up: MigrationFunction = (migration: Migration) => {
  const mediaFolder = migration
    .createContentType("mediaFolder")
    .name("Media Folder")
    .displayField("name")
    .description(
      "A folder used for categorising the presentation in the Media Tools Library"
    );

  mediaFolder
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  mediaFolder
    .createField("children")
    .name("Children")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["mediaFolder", "mediaTool"] }],
      linkType: "Entry"
    });

  mediaFolder.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "A short name for the folder"
  });
  mediaFolder.changeFieldControl("children", "builtin", "entryCardsEditor", {
    helpText:
      "Contents of the folder - either media tools or other media folders (sub-folders of the current one)",
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("mediaFolder");
