module.exports.description = "Make bodyTitle and bodyList fields optional";

module.exports.up = (migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic.editField("bodyTitle").required(false);
  contentTopic.editField("bodyList").required(false);

  contentTopic.changeFieldControl("title", "builtin", "singleLine", {
    helpText:
      "Be sure to include at least one body list item or a footer list item."
  });
  contentTopic.changeFieldControl("bodyTitle", "builtin", "singleLine", {
    helpText: "If you add a body title, please add a body list."
  });
  contentTopic.changeFieldControl("footerTitle", "builtin", "singleLine", {
    helpText: "If you add a footer title, please add a footer list."
  });
};

module.exports.down = (migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic.editField("bodyTitle").required(true);
  contentTopic.editField("bodyList").required(true);

  contentTopic.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  contentTopic.changeFieldControl("bodyTitle", "builtin", "singleLine", {
    helpText: ""
  });
  contentTopic.changeFieldControl("footerTitle", "builtin", "singleLine", {
    helpText: ""
  });
};
