"use strict";

module.exports.description = "Create content model for Contact Topic.";

module.exports.up = (migration) => {
  const contactTopic = migration
    .createContentType("contactTopic")
    .name("Contact Topic")
    .displayField("title");

  contactTopic
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

  contactTopic.createField("title").name("Title").type("Symbol").required(true);

  contactTopic
    .createField("bodyTitle")
    .name("Body title")
    .type("Symbol")
    .required(true);

  contactTopic
    .createField("bodyList")
    .name("Body list")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });

  contactTopic.createField("footerTitle").name("Footer title").type("Symbol");

  contactTopic
    .createField("footerList")
    .name("Footer list")
    .type("Array")
    .validations([{ size: { max: 4 } }])
    .items({
      type: "Link",
      validations: [
        { linkContentType: ["contactDetails", "titleWithContent"] }
      ],
      linkType: "Entry"
    });
};

module.exports.down = (migration) =>
  migration.deleteContentType("contactTopic");
