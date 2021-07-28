module.exports.description = "Move contentTopic up.";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.moveField("contentTopics").afterField("queriesSubtitle");
  contactUsPage.editField("contentTopics").name("Contact Topics");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.moveField("contentTopics").afterField("locations");
  contactUsPage.editField("contentTopics").name("Content topics");
};
