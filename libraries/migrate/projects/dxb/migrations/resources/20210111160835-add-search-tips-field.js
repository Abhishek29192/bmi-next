module.exports.description =
  "Add search page search tips to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageSearchTips")
    .name("Search Page: Search Tips")
    .type("Link")
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageSearchTips");
};
