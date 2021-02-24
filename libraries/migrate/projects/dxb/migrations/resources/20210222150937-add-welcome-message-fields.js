const icons = require("../../variables/icons/20210120155354").brands;

module.exports.description = "Add Welcome message for homepage";

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

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("welcomeDialogTitle");
  resources.deleteField("welcomeDialogBrands");
  resources.deleteField("welcomeDialogBody");
};
