"use strict";

module.exports.description = "Add retry fields to InputBanner Content Type";

const enabledNodeTypes = [
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
  const inputBanner = migration.editContentType("inputBanner");
  inputBanner
    .createField("allowRetry")
    .name("Allow retry on error")
    .type("Symbol")
    .validations([{ in: ["Yes", "No"] }])
    .required(true);
  inputBanner
    .createField("errorTitle")
    .name("Retry title")
    .type("Symbol")
    .required(true);
  inputBanner
    .createField("errorBody")
    .name("Retry body content")
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
    ])
    .required(true);
  inputBanner
    .createField("retryButtonLabel")
    .name("Retry Button label")
    .type("Symbol")
    .required(true);

  inputBanner.changeFieldControl("allowRetry", "builtin", "radio", {
    helpText: "Hide or show retry button."
  });

  inputBanner.changeFieldControl("errorTitle", "builtin", "singleLine", {
    helpText: "Retry dialog title text."
  });

  inputBanner.changeFieldControl("errorBody", "builtin", "richTextEditor", {
    helpText: "The retry dialog body that will be used for dialog content."
  });

  inputBanner.changeFieldControl("retryButtonLabel", "builtin", "singleLine", {
    helpText: "Retry button text when visible."
  });
};

module.exports.down = (migration) => {
  const inputBanner = migration.editContentType("inputBanner");
  inputBanner.deleteField("allowRetry");
  inputBanner.deleteField("errorTitle");
  inputBanner.deleteField("errorBody");
  inputBanner.deleteField("retryButtonLabel");
};
