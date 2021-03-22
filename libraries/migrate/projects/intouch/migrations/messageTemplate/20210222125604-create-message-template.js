const messageEvents = require("../../variables/messageEvents/20210222125604");
const messageFormats = require("../../variables/messageFormats/20210222125604");

module.exports.description = "Create content model for Message Template";

module.exports.up = (migration) => {
  const messageTemplate = migration
    .createContentType("messageTemplate")
    .name("Message Template")
    .displayField("event")
    .description("A template for email and/or notifications");

  messageTemplate
    .createField("event")
    .name("Event")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, { in: messageEvents }]);

  messageTemplate
    .createField("format")
    .name("Format")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [{ in: messageFormats }]
    });

  messageTemplate
    .createField("subject")
    .name("Subject")
    .type("Symbol")
    .required(true);

  messageTemplate
    .createField("notificationBody")
    .name("Notification Body")
    .type("RichText")
    .validations([{ nodes: {} }]);

  messageTemplate.createField("emailBody").name("EmailBody").type("Symbol");

  messageTemplate.changeFieldControl("event", "builtin", "dropdown");
  messageTemplate.changeFieldControl("format", "builtin", "checkbox");
  messageTemplate.changeFieldControl("subject", "builtin", "singleLine");
  messageTemplate.changeFieldControl(
    "notificationBody",
    "builtin",
    "richTextEditor"
  );
  messageTemplate.changeFieldControl("emailBody", "builtin", "singleLine");
};

module.exports.down = (migration) =>
  migration.deleteContentType("messageTemplate");
