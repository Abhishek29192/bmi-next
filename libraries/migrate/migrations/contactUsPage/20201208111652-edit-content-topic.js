module.exports.description =
  "Change field name from contentTopic to contactTopic.";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("contentTopics");

  contactUsPage
    .createField("contactTopics")
    .name("Contact topics")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactTopic"] }],
      linkType: "Entry"
    });

  contactUsPage.moveField("contactTopics").afterField("queriesSubtitle");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("contactTopics");

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
