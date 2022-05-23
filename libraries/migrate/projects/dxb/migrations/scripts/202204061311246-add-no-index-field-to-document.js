module.exports.description = "Add no-index field.";

module.exports.up = (migration) => {
  const page = migration.editContentType("document");

  page
    .createField("noIndex")
    .name("Exclude from search")
    .type("Boolean")
    .required(false);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("document");
  page.deleteField("noIndex");
};
