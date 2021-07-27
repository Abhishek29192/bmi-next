"use strict";

module.exports.description = "Add sections field";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["cardCollectionSection", "tabsOrAccordionSection"]
        }
      ],
      linkType: "Entry"
    });

  contactUsPage.moveField("sections").afterField("contentTopics");
};

module.exports.down = (migration) => {
  migration.editContentType("contactUsPage").deleteField("sections");
};
