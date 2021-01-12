module.exports.description =
  "Add search page explore bar to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageExploreBar")
    .name("Search Page: Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageExploreBar");
};
