module.exports.description = "Delete content type.";

module.exports.up = (migration) => {
  migration.deleteContentType("contentTopic");
};

module.exports.down = (migration) => {
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
