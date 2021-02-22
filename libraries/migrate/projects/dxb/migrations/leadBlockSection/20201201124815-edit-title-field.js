module.exports.description = "Edit the title field for the Lead Block Section";

module.exports.up = (migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection.editField("title").required(true);

  leadBlockSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This is only used for Contentful"
  });
};

module.exports.down = (migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection.editField("title").required(false);

  leadBlockSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
};
