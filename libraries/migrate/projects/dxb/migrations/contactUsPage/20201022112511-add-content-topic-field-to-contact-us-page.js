"use strict";

module.exports.description = "Add Content Topics field to Contact Us page";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("contentTopics")
    .name("Content topics")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contentTopic"] }],
      linkType: "Entry"
    });

  contactUsPage.moveField("contentTopics").afterField("queriesSubtitle");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("contentTopics");
};
