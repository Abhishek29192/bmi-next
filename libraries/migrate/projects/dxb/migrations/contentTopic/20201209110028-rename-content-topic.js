module.exports.description = "Rename content-topic to contact-topic";

module.exports.up = (migration) => {
  const contactTopic = migration.editContentType("contentTopic");

  contactTopic.name("Contact Topic");

  contactTopic.editField("footerList").items({
    type: "Link",
    validations: [{ linkContentType: ["contactDetails", "titleWithContent"] }],
    linkType: "Entry"
  });
};

module.exports.down = (migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic.name("Content Topic");

  contentTopic.editField("footerList").items({
    type: "Link",
    validations: [{ linkContentType: ["navigation", "titleWithContent"] }],
    linkType: "Entry"
  });
};
