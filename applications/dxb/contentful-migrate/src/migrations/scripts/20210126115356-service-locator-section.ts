import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content type for find a roofer section";

const enabledNodeTypes = [
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "ordered-list",
  "unordered-list",
  "hr",
  "blockquote",
  "embedded-entry-block",
  "embedded-asset-block",
  "hyperlink",
  "entry-hyperlink",
  "asset-hyperlink",
  "embedded-entry-inline"
];

export const up: MigrationFunction = (migration: Migration) => {
  const serviceLocatorSection = migration
    .createContentType("serviceLocatorSection")
    .name("Service Locator Section")
    .displayField("title")
    .description("");

  serviceLocatorSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  serviceLocatorSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This field is the title of the Contentful entry only."
  });

  serviceLocatorSection
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  serviceLocatorSection.changeFieldControl("label", "builtin", "singleLine", {
    helpText: "This field is the title of the section."
  });

  serviceLocatorSection
    .createField("body")
    .name("Body")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes,
        message: `Only ${enabledNodeTypes
          .map((nodeType) => nodeType.replace(/-/g, " "))
          .join(", ")} nodes are allowed`
      },
      {
        nodes: {
          "embedded-entry-block": [{ linkContentType: ["link", "table"] }],
          "embedded-entry-inline": [{ linkContentType: ["link"] }]
        }
      }
    ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("serviceLocatorSection");
};
