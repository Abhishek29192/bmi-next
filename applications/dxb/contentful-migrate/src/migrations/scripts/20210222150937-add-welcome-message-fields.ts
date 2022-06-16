import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands as icons } from "../../variables/icons/20210120155354";

export const description = "Add Welcome message for homepage";

const enabledNodeTypes = [
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
  const resources = migration.editContentType("resources");

  resources
    .createField("welcomeDialogTitle")
    .required(false)
    .name("Welcome dialog: Title")
    .type("Symbol");

  resources
    .createField("welcomeDialogBrands")
    .name("Welcome dialog: Brands")
    .type("Array")
    .required(false)
    .items({
      type: "Symbol",
      validations: [{ in: icons }]
    });

  resources
    .createField("welcomeDialogBody")
    .name("Welcome dialog: Body")
    .type("RichText")
    .required(false)
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

  resources.changeFieldControl(
    "welcomeDialogBody",
    "builtin",
    "richTextEditor",
    {
      helpText: "The welcome body content will be used for dialog content."
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("welcomeDialogTitle");
  resources.deleteField("welcomeDialogBrands");
  resources.deleteField("welcomeDialogBody");
};
