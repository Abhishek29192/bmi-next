"use strict";

module.exports.description = "";

module.exports.up = (migration) => {
  const contentTopic = migration
    .createContentType("contentTopic")
    .name("Content Topic")
    .displayField("title");

  contentTopic
    .createField("icon")
    .name("Icon")
    .type("Symbol")
    .validations([
      { regexp: { pattern: "" } },
      {
        in: [
          "build",
          "shoppingCart",
          "localShipping",
          "reportProblem",
          "info",
          "findReplace",
          "verifiedUser",
          "help"
        ]
      }
    ]);

  contentTopic.createField("title").name("Title").type("Symbol").required(true);

  contentTopic
    .createField("bodyTitle")
    .name("Body title")
    .type("Symbol")
    .required(true);

  contentTopic
    .createField("bodyList")
    .name("Body list")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });

  contentTopic.createField("footerTitle").name("Footer title").type("Symbol");

  contentTopic
    .createField("footerList")
    .name("Footer list")
    .type("Array")
    .validations([{ size: { max: 4 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["navigation", "titleWithContent"] }],
      linkType: "Entry"
    });
};

module.exports.down = (migration) =>
  migration.deleteContentType("contentTopic");
