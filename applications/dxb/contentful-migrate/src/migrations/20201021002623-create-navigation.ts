import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Navigation";

export const up: MigrationFunction = (migration) => {
  const navigation = migration
    .createContentType("navigation")
    .name("Navigation")
    .displayField("title")
    .description("");

  navigation
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  navigation.createField("label").name("Label").type("Symbol").required(true);

  navigation
    .createField("links")
    .name("Links")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [
        { linkContentType: ["link", "navigation", "navigationItem"] }
      ],
      linkType: "Entry"
    });

  navigation
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  navigation.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This is only used for Contentful"
  });
  navigation.changeFieldControl("label", "builtin", "singleLine");
  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    bulkEditing: true,
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  navigation.changeFieldControl("link", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("navigation");
